import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DEFAULT_TIME_LIMIT_SECONDS } from "@/lib/constants";
import type { Question, SanitizedQuestion } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Rotation categories — 3 questions are drawn from each, per round. */
const CATEGORIES = ["cinema", "tecnico", "gestao"] as const;
const PER_CATEGORY = 3;

type PoolRow = Omit<Question, "correct_option" | "created_at">;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sanitize(q: PoolRow): SanitizedQuestion {
  return {
    id: q.id,
    text: q.text,
    options: q.options,
    time_limit_seconds: q.time_limit_seconds ?? DEFAULT_TIME_LIMIT_SECONDS,
    order_index: q.order_index,
  };
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("quiz_questions")
    .select("id, text, options, time_limit_seconds, order_index, category, is_fixed")
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data as PoolRow[];
  const fixed = rows.filter((q) => q.is_fixed);
  const pool = rows.filter((q) => !q.is_fixed);

  // 3 random questions per category, shuffled among themselves, then the
  // fixed question(s) always last — never part of the random draw.
  const drawn = CATEGORIES.flatMap((category) =>
    shuffle(pool.filter((q) => q.category === category)).slice(0, PER_CATEGORY)
  );

  const questions: SanitizedQuestion[] = [
    ...shuffle(drawn).map(sanitize),
    ...fixed.map(sanitize),
  ];

  return NextResponse.json({ questions });
}
