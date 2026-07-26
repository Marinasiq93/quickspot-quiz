"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "@/lib/types";

const PLACE_STYLES = [
  { badge: "bg-yellow-400 text-yellow-950", label: "1º" },
  { badge: "bg-zinc-300 text-zinc-800", label: "2º" },
  { badge: "bg-amber-600 text-amber-50", label: "3º" },
  { badge: "bg-black/10 text-foreground", label: "4º" },
];

export default function RankingBoard() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchTop4() {
      const { data } = await supabase
        .from("quiz_leaderboard")
        .select("participant_id, participant_name, best_score, best_total_time_ms, updated_at")
        .order("best_score", { ascending: false })
        .order("best_total_time_ms", { ascending: true })
        .limit(4);

      if (active) setEntries((data as LeaderboardEntry[]) ?? []);
    }

    fetchTop4();

    const channel = supabase
      .channel("leaderboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "quiz_leaderboard" }, () => {
        fetchTop4();
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (entries === null) {
    return <p className="text-foreground/50">Carregando ranking...</p>;
  }

  if (entries.length === 0) {
    return <p className="text-foreground/50">Ainda não há participantes. Seja o primeiro a jogar!</p>;
  }

  return (
    <ol className="flex w-full max-w-2xl flex-col gap-4">
      {entries.map((entry, index) => {
        const style = PLACE_STYLES[index];
        return (
          <li
            key={entry.participant_id}
            className="flex items-center gap-5 rounded-2xl border border-black/5 bg-white px-6 py-5 shadow-sm"
          >
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-extrabold ${style.badge}`}
            >
              {style.label}
            </span>
            <span className="flex-1 truncate text-2xl font-semibold">
              {entry.participant_name}
            </span>
            <span className="text-3xl font-extrabold text-coral">{entry.best_score}</span>
          </li>
        );
      })}
    </ol>
  );
}
