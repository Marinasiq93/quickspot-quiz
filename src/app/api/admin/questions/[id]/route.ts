import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { questionInputSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/questions/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = questionInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("quiz_questions")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ question: data });
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/questions/[id]">
) {
  const { id } = await ctx.params;
  const { error } = await supabaseAdmin.from("quiz_questions").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
