import Link from "next/link";

export type QuizResult = {
  score: number;
  correctCount: number;
  wrongCount: number;
  totalTimeMs: number;
  totalQuestions: number;
};

export default function ResultScreen({ result }: { result: QuizResult }) {
  const seconds = (result.totalTimeMs / 1000).toFixed(1);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
      <p className="mb-1 text-sm font-medium text-foreground/50">Sua pontuação</p>
      <p className="mb-6 text-6xl font-extrabold text-coral">{result.score}</p>

      <div className="mb-6 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-lg bg-black/5 py-2">
          <p className="font-semibold text-green-600">{result.correctCount}</p>
          <p className="text-foreground/50">acertos</p>
        </div>
        <div className="rounded-lg bg-black/5 py-2">
          <p className="font-semibold text-red-500">{result.wrongCount}</p>
          <p className="text-foreground/50">erros</p>
        </div>
        <div className="rounded-lg bg-black/5 py-2">
          <p className="font-semibold">{seconds}s</p>
          <p className="text-foreground/50">tempo</p>
        </div>
      </div>

      <Link
        href="/ranking"
        className="block w-full rounded-lg bg-coral px-4 py-2 font-medium text-white hover:bg-coral-dark"
      >
        Ver ranking ao vivo
      </Link>
    </div>
  );
}
