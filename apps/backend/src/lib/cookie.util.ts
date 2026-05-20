import { env } from "@task-forge/shared/env";
import type { FastifyReply } from "fastify";

const isProduction = env.NODE_ENV === "production";

export function setAuthCookie(reply: FastifyReply, token: string): void {
  void reply.setCookie(env.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(reply: FastifyReply): void {
  void reply.clearCookie(env.AUTH_COOKIE_NAME, {
    path: "/",
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
}
