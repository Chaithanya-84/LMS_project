import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { verifyAccessToken } from "../utils/jwt.js";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { sub } = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: parseInt(sub, 10) },
    });
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
