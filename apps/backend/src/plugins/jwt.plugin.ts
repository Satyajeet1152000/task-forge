import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import { env } from "@task-forge/shared/env";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export async function registerJwt(app: FastifyInstance): Promise<void> {
  await app.register(cookie);
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN,
    },
    cookie: {
      cookieName: env.AUTH_COOKIE_NAME,
      signed: false,
    },
  });

  app.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const token =
          request.headers.authorization?.replace(/^Bearer\s+/i, "") ??
          request.cookies[env.AUTH_COOKIE_NAME];
        if (token) {
          request.headers.authorization = `Bearer ${token}`;
        }
        const payload = await request.jwtVerify<{ sub: number }>();
        request.userId = Number(payload.sub);
      } catch {
        return reply.status(401).send({ error: "Unauthorized" });
      }
    },
  );
}
