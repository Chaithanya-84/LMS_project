import { env } from "./env.js";

const isProduction = process.env.NODE_ENV === "production";
// Cross-origin (Vercel + Railway): SameSite=None required for cookies to be sent
const sameSite = isProduction ? ("none" as const) : ("lax" as const);

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: "/",
  // In production cross-origin, omit domain so cookie is set for backend host
  ...(env.cookieDomain && env.cookieDomain !== "localhost"
    ? { domain: env.cookieDomain }
    : {}),
};
