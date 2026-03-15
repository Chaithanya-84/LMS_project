import type { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  createRefreshToken,
  revokeRefreshToken,
  validateRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} from "./auth.service.js";
import { signAccessToken } from "../../utils/jwt.js";
import crypto from "crypto";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body;
    const user = await registerUser(email, password, name);
    const accessToken = signAccessToken(user);
    const tokenValue = await createRefreshToken(user.id);
    setRefreshCookie(res, tokenValue);

    res.status(201).json({
      user: { id: user.id.toString(), email: user.email, name: user.name },
      accessToken,
      expiresIn: 900, // 15 min in seconds
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Email already registered") {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    const accessToken = signAccessToken(user);
    const tokenValue = await createRefreshToken(user.id);
    setRefreshCookie(res, tokenValue);

    res.json({
      user: { id: user.id.toString(), email: user.email, name: user.name },
      accessToken,
      expiresIn: 900,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Invalid email or password") {
      res.status(401).json({ error: err.message });
      return;
    }
    throw err;
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refresh_token;
  if (!token) {
    res.status(401).json({ error: "No refresh token" });
    return;
  }

  const user = await validateRefreshToken(token);
  if (!user) {
    clearRefreshCookie(res);
    res.status(401).json({ error: "Invalid or expired refresh token" });
    return;
  }

  const accessToken = signAccessToken(user);
  res.json({ accessToken, expiresIn: 900 });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refresh_token;
  if (token) {
    await revokeRefreshToken(token);
  }
  clearRefreshCookie(res);
  res.json({ message: "Logged out" });
}
