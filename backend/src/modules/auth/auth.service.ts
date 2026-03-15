import { prisma } from "../../config/db.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { signAccessToken } from "../../utils/jwt.js";
import crypto from "crypto";
import { env } from "../../config/env.js";
import { cookieOptions } from "../../config/security.js";

export async function registerUser(email: string, password: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already registered");
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }
  return user;
}

export async function createRefreshToken(userId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt },
  });
  return token;
}

export async function revokeRefreshToken(token: string): Promise<void> {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  });
}

export async function validateRefreshToken(token: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const row = await prisma.refreshToken.findFirst({
    where: { tokenHash },
    include: { user: true },
  });

  if (!row || row.revokedAt || row.expiresAt < new Date()) {
    return null;
  }
  return row.user;
}

export function setRefreshCookie(res: import("express").Response, token: string): void {
  res.cookie("refresh_token", token, cookieOptions);
}

export function clearRefreshCookie(res: import("express").Response): void {
  res.clearCookie("refresh_token", {
    ...cookieOptions,
    maxAge: 0,
  });
}
