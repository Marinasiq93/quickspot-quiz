import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { questionInputSchema } from "@/lib/validation";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("quiz_questions")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ questions: data });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = questionInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { data: maxRow } = await supabaseAdmin
    .from("quiz_questions")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrderIndex = (maxRow?.order_index ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("quiz_questions")
    .insert({ ...parsed.data, order_index: nextOrderIndex })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ question: data }, { status: 201 });
}
