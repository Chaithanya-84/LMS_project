import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { User } from "@prisma/client";

export function signAccessToken(user: User): string {
  return jwt.sign(
    { sub: user.id.toString(), type: "access" },
    env.jwtAccessSecret,
    { expiresIn: env.accessTokenExpiry }
  );
}

export function signRefreshToken(user: User): string {
  return jwt.sign(
    { sub: user.id.toString(), type: "refresh" },
    env.jwtRefreshSecret,
    { expiresIn: env.refreshTokenExpiry }
  );
}

export function verifyAccessToken(token: string): { sub: string } {
  const decoded = jwt.verify(token, env.jwtAccessSecret) as { sub: string };
  return decoded;
}

export function verifyRefreshToken(token: string): { sub: string } {
  const decoded = jwt.verify(token, env.jwtRefreshSecret) as { sub: string };
  return decoded;
}
