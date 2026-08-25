-- Quickspot Quiz — schema, RLS policies, and Realtime setup.
-- Run this once in the Supabase SQL editor for your project.
--
-- All tables/functions are prefixed with quiz_ so they can't collide with
-- anything in a shared project (e.g. the Quickspot CRM database).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  options jsonb not null,
  correct_option smallint not null,
  time_limit_seconds int,
  order_index int not null,
  -- Rotation category ("cinema" | "tecnico" | "gestao"); null for the fixed question.
  category text,
  -- Marks the one question always shown last, outside the category rotation.
  is_fixed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists quiz_participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references quiz_participants(id) on delete cascade,
  participant_name text not null,
  score int not null,
  correct_count int not null,
  wrong_count int not null,
  total_time_ms int not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists quiz_attempts_participant_id_idx on quiz_attempts (participant_id);
create index if not exists quiz_attempts_created_at_idx on quiz_attempts (created_at desc);

create table if not exists quiz_leaderboard (
  participant_id uuid primary key references quiz_participants(id) on delete cascade,
  participant_name text not null,
  best_score int not null,
  best_total_time_ms int not null,
  updated_at timestamptz not null default now()
);

create index if not exists quiz_leaderboard_rank_idx on quiz_leaderboard (best_score desc, best_total_time_ms asc);

-- ---------------------------------------------------------------------------
-- RPC: upsert a participant's leaderboard row only if this attempt is better
-- (higher score, or same score with a lower total time).
-- ---------------------------------------------------------------------------

create or replace function quiz_upsert_leaderboard_best(
  p_participant_id uuid,
  p_participant_name text,
  p_score int,
  p_total_time_ms int
) returns void
language sql
security definer
set search_path = public
as $$
  insert into quiz_leaderboard (participant_id, participant_name, best_score, best_total_time_ms, updated_at)
  values (p_participant_id, p_participant_name, p_score, p_total_time_ms, now())
  on conflict (participant_id) do update
    set participant_name = excluded.participant_name,
        best_score = excluded.best_score,
        best_total_time_ms = excluded.best_total_time_ms,
        updated_at = now()
    where excluded.best_score > quiz_leaderboard.best_score
       or (excluded.best_score = quiz_leaderboard.best_score
           and excluded.best_total_time_ms < quiz_leaderboard.best_total_time_ms);
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- quiz_questions / quiz_participants / quiz_attempts get NO anon policies at
-- all. The app never lets the browser talk to Supabase for these — every
-- read and write goes through a Next.js Route Handler using the service
-- role key, which bypasses RLS entirely. This is what keeps correct answers
-- and participant PII (email/phone/answers) out of reach of the public
-- client, and out of reach of anything else sharing this Supabase project.
--
-- quiz_leaderboard is the one table the public ranking page reads directly
-- (anon key) and subscribes to via Realtime.
-- ---------------------------------------------------------------------------

alter table quiz_questions enable row level security;
alter table quiz_participants enable row level security;
alter table quiz_attempts enable row level security;
alter table quiz_leaderboard enable row level security;

drop policy if exists "public can read leaderboard" on quiz_leaderboard;
create policy "public can read leaderboard"
  on quiz_leaderboard for select
  to anon
  using (true);

-- Enable Realtime replication for the leaderboard table (idempotent).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'quiz_leaderboard'
  ) then
    alter publication supabase_realtime add table quiz_leaderboard;
  end if;
end $$;
