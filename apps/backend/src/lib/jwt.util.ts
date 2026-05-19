import { env } from "@task-forge/shared/env";
import type { AuthTokenPayload } from "@task-forge/shared/types";
import jwt from "jsonwebtoken";

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(
    { ...payload, sub: String(payload.sub) },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    },
  );
}

export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded === "string" || !decoded || typeof decoded !== "object") {
    throw new Error("Invalid token");
  }
  const payload = decoded as unknown as AuthTokenPayload;
  return {
    sub: Number(payload.sub),
    email: payload.email,
    role: payload.role,
  };
}
