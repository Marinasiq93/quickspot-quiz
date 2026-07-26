"use client";

import { useEffect, useRef, useState } from "react";

export default function Timer({
  durationSeconds,
  onExpire,
}: {
  durationSeconds: number;
  onExpire: () => void;
}) {
  const durationMs = durationSeconds * 1000;
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const expiredRef = useRef(false);

  useEffect(() => {
    expiredRef.current = false;
    const startedAt = Date.now();

    const interval = setInterval(() => {
      const remaining = Math.max(0, durationMs - (Date.now() - startedAt));
      setRemainingMs(remaining);

      if (remaining === 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(interval);
        onExpire();
      }
    }, 100);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs]);

  const fraction = remainingMs / durationMs;
  const isUrgent = fraction < 0.25;

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-40 overflow-hidden rounded-full bg-black/10">
        <div
          className={`h-full rounded-full transition-[width] duration-100 ease-linear ${
            isUrgent ? "bg-red-500" : "bg-coral"
          }`}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
      <span className={`w-8 text-sm font-semibold tabular-nums ${isUrgent ? "text-red-500" : "text-foreground/70"}`}>
        {Math.ceil(remainingMs / 1000)}s
      </span>
    </div>
  );
}
