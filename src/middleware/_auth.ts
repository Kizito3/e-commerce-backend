import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  role?: "user" | "admin";
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    // get token from the headers
    const header = req.headers["authorization"];
    if (!header || !header.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // extract token from the header
    const token = header.slice("Bearer ".length);
    const secret = process.env.JWT_SECRET as string;

    if (!secret) {
      return res.status(500).json({ message: "internal server error" });
    }

    const payload = jwt.verify(token, secret) as {
      userId: string;
      role: "user" | "admin";
    };
    req.userId = payload.userId;
    req.role = payload.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid token" });
  }
}
