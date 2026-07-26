export const BASE_POINTS = 100;
export const MAX_SPEED_BONUS = 50;

export const DEFAULT_TIME_LIMIT_SECONDS = Number(
  process.env.DEFAULT_TIME_LIMIT_SECONDS ?? 20
);

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 6;

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12h
