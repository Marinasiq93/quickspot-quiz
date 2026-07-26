type Row = {
  id: string;
  name: string;
  email: string;
  phone: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  totalTimeMs: number;
  createdAt: string;
  attemptCount: number;
};

export default function ParticipantsTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return <p className="text-foreground/60">Ainda não há participantes.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-black/5 text-foreground/50">
          <tr>
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">E-mail</th>
            <th className="px-4 py-3 font-medium">Telefone</th>
            <th className="px-4 py-3 font-medium">Pontuação</th>
            <th className="px-4 py-3 font-medium">Acertos</th>
            <th className="px-4 py-3 font-medium">Erros</th>
            <th className="px-4 py-3 font-medium">Tempo</th>
            <th className="px-4 py-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={`border-b border-black/5 last:border-0 ${
                row.attemptCount > 1 ? "bg-amber-50" : ""
              }`}
            >
              <td className="px-4 py-3 font-medium">
                <div className="flex items-center gap-2">
                  {row.name}
                  {row.attemptCount > 1 && (
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">
                      repetido · {row.attemptCount}x
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-foreground/70">{row.email}</td>
              <td className="px-4 py-3 text-foreground/70">{row.phone}</td>
              <td className="px-4 py-3 font-semibold text-coral">{row.score}</td>
              <td className="px-4 py-3 text-green-600">{row.correctCount}</td>
              <td className="px-4 py-3 text-red-500">{row.wrongCount}</td>
              <td className="px-4 py-3">{(row.totalTimeMs / 1000).toFixed(1)}s</td>
              <td className="px-4 py-3 text-foreground/50">
                {new Date(row.createdAt).toLocaleString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
