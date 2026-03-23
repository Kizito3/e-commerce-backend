import { Response, NextFunction } from "express";
import { AuthRequest } from "./_auth";

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admins only" });
  }
  next();
}
