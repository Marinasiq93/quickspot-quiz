import { Download } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ParticipantsTable from "@/components/admin/ParticipantsTable";

export const dynamic = "force-dynamic";

type AttemptRow = {
  id: string;
  participant_name: string;
  score: number;
  correct_count: number;
  wrong_count: number;
  total_time_ms: number;
  created_at: string;
  quiz_participants: { email: string; phone: string } | null;
};

export default async function AdminParticipantsPage() {
  const { data } = await supabaseAdmin
    .from("quiz_attempts")
    .select(
      "id, participant_name, score, correct_count, wrong_count, total_time_ms, created_at, quiz_participants(email, phone)"
    )
    .order("created_at", { ascending: false });

  const rows = ((data as unknown as AttemptRow[]) ?? []).map((row) => ({
    id: row.id,
    name: row.participant_name,
    email: row.quiz_participants?.email ?? "",
    phone: row.quiz_participants?.phone ?? "",
    score: row.score,
    correctCount: row.correct_count,
    wrongCount: row.wrong_count,
    totalTimeMs: row.total_time_ms,
    createdAt: row.created_at,
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Participantes</h1>
        <a
          href="/api/admin/export"
          className="flex items-center gap-2 rounded-lg bg-coral px-4 py-2 text-sm font-medium text-white hover:bg-coral-dark"
        >
          <Download size={16} /> Exportar CSV
        </a>
      </div>

      <ParticipantsTable rows={rows} />
    </div>
  );
}
