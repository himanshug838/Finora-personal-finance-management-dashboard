export const ACCESS_TOKEN_EXPIRES_IN =
  process.env.JWT_ACCESS_EXPIRES_IN || "15m";

export const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

export const REFRESH_TOKEN_COOKIE_NAME =
  "finora_refresh_token";

export const getRefreshCookieOptions = () => ({
  httpOnly: true,

  secure:
    process.env.COOKIE_SECURE === "true",

  sameSite:
    process.env.COOKIE_SAME_SITE || "lax",

  maxAge:
    7 * 24 * 60 * 60 * 1000,

  path: "/api/v1/auth",
});