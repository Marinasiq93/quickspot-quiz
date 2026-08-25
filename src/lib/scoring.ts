import { BASE_POINTS, MAX_SPEED_BONUS } from "@/lib/constants";

/**
 * Correct: 100 base points + up to 50 speed-bonus points scaled by how much
 * of the reference time (timeLimitMs) was left when the answer was
 * submitted (150 max, instant answer). There's no cutoff — a person can take
 * as long as they want; answering past the reference time still awards the
 * 100 base points, the speed bonus just floors at 0. Wrong: 0 points.
 *
 * clampedElapsedMs is the real elapsed time (only floored at 0, never capped
 * to the reference time) so total time still reflects how long someone
 * actually took, used as the ranking tiebreaker.
 */
export function scoreAnswer(
  isCorrect: boolean,
  timeLimitMs: number,
  elapsedMs: number
): { points: number; clampedElapsedMs: number } {
  const clampedElapsedMs = Math.max(elapsedMs, 0);

  if (!isCorrect) {
    return { points: 0, clampedElapsedMs };
  }

  const timeRemainingMs = Math.max(timeLimitMs - clampedElapsedMs, 0);
  const speedBonus = Math.round(
    MAX_SPEED_BONUS * (timeRemainingMs / timeLimitMs)
  );

  return { points: BASE_POINTS + speedBonus, clampedElapsedMs };
}
