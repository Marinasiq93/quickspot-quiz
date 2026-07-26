import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DEFAULT_TIME_LIMIT_SECONDS } from "@/lib/constants";
import type { Question, SanitizedQuestion } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("quiz_questions")
    .select("id, text, options, time_limit_seconds, order_index")
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const questions: SanitizedQuestion[] = (data as Omit<Question, "correct_option" | "created_at">[]).map(
    (q) => ({
      id: q.id,
      text: q.text,
      options: q.options,
      time_limit_seconds: q.time_limit_seconds ?? DEFAULT_TIME_LIMIT_SECONDS,
      order_index: q.order_index,
    })
  );

  return NextResponse.json({ questions });
}
