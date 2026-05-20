import { verifyToken } from "@lib/jwt.util";
import { UnauthorizedError } from "@modules/auth/auth.error";
import { env } from "@task-forge/shared/env";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function requireAuth(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const token = request.cookies[env.AUTH_COOKIE_NAME];
  if (!token) {
    throw new UnauthorizedError("Authentication required");
  }
  try {
    const payload = verifyToken(token);
    request.userId = payload.sub;
  } catch {
    throw new UnauthorizedError("Invalid or expired session");
  }
}
