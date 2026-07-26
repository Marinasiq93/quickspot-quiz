import { NextResponse } from "next/server";
import * as z from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

const querySchema = z.object({ email: z.email() });

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email") ?? "";
  const parsed = querySchema.safeParse({ email });
  if (!parsed.success) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  const { data: participant } = await supabaseAdmin
    .from("quiz_participants")
    .select("id")
    .eq("email", parsed.data.email.trim().toLowerCase())
    .maybeSingle();

  if (!participant) {
    return NextResponse.json({ alreadyParticipated: false });
  }

  const { count } = await supabaseAdmin
    .from("quiz_attempts")
    .select("id", { count: "exact", head: true })
    .eq("participant_id", participant.id);

  return NextResponse.json({ alreadyParticipated: (count ?? 0) > 0 });
}
