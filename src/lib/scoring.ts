import { BASE_POINTS, MAX_SPEED_BONUS } from "@/lib/constants";

/**
 * Correct: 100 base points + up to 50 speed-bonus points scaled by the
 * fraction of time remaining when the answer was submitted (150 max,
 * instant answer). Wrong or timed-out: 0 points.
 */
export function scoreAnswer(
  isCorrect: boolean,
  timeLimitMs: number,
  elapsedMs: number
): { points: number; clampedElapsedMs: number } {
  const clampedElapsedMs = Math.min(Math.max(elapsedMs, 0), timeLimitMs);

  if (!isCorrect) {
    return { points: 0, clampedElapsedMs };
  }

  const timeRemainingMs = timeLimitMs - clampedElapsedMs;
  const speedBonus = Math.round(
    MAX_SPEED_BONUS * (timeRemainingMs / timeLimitMs)
  );

  return { points: BASE_POINTS + speedBonus, clampedElapsedMs };
}
