import { supabaseAdmin } from "@/lib/supabase/admin";
import { toCsv } from "@/lib/csv";

type AttemptRow = {
  participant_name: string;
  score: number;
  correct_count: number;
  wrong_count: number;
  total_time_ms: number;
  created_at: string;
  quiz_participants: { email: string; phone: string } | null;
};

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("quiz_attempts")
    .select(
      "participant_name, score, correct_count, wrong_count, total_time_ms, created_at, quiz_participants(email, phone)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const rows = (data as unknown as AttemptRow[]).map((row) => [
    row.participant_name,
    row.quiz_participants?.email ?? "",
    row.quiz_participants?.phone ?? "",
    row.score,
    row.correct_count,
    row.wrong_count,
    (row.total_time_ms / 1000).toFixed(1),
    new Date(row.created_at).toLocaleString("pt-BR"),
  ]);

  const csv = toCsv(
    ["Nome", "E-mail", "Telefone", "Pontuação", "Acertos", "Erros", "Tempo (s)", "Data"],
    rows
  );

  const filename = `quickspot-quiz-participantes-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
