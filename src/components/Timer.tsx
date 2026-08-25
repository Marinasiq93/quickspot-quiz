"use client";

import { useEffect, useState } from "react";

/**
 * Cronômetro visual — só mostra quanto tempo a pessoa está levando na
 * pergunta atual. Não tem limite: nunca força avanço nem trava a resposta.
 */
export default function Timer() {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm font-semibold tabular-nums text-foreground/60">
      <span className="h-2 w-2 rounded-full bg-coral" />
      <span>{(elapsedMs / 1000).toFixed(1)}s</span>
    </div>
  );
}
