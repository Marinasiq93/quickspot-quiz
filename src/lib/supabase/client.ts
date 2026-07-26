import { createClient } from "@supabase/supabase-js";

/**
 * Browser client, anon key. RLS only grants this key read access to the
 * `leaderboard` table — every other read/write goes through a Route Handler.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
