import { supabaseAdmin } from "@/lib/supabase/admin";
import { toCsv } from "@/lib/csv";

type AttemptRow = {
  participant_id: string;
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
      "participant_id, participant_name, score, correct_count, wrong_count, total_time_ms, created_at, quiz_participants(email, phone)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const attempts = data as unknown as AttemptRow[];

  const attemptCountByParticipant = new Map<string, number>();
  for (const row of attempts) {
    attemptCountByParticipant.set(
      row.participant_id,
      (attemptCountByParticipant.get(row.participant_id) ?? 0) + 1
    );
  }

  const rows = attempts.map((row) => [
    row.participant_name,
    row.quiz_participants?.email ?? "",
    row.quiz_participants?.phone ?? "",
    row.score,
    row.correct_count,
    row.wrong_count,
    (row.total_time_ms / 1000).toFixed(1),
    new Date(row.created_at).toLocaleString("pt-BR"),
    attemptCountByParticipant.get(row.participant_id) ?? 1,
  ]);

  const csv = toCsv(
    ["Nome", "E-mail", "Telefone", "Pontuação", "Acertos", "Erros", "Tempo (s)", "Data", "Nº de tentativas deste e-mail"],
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
