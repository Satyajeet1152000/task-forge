import cors from "@fastify/cors";
import { env } from "@task-forge/shared/env";
import type { FastifyInstance } from "fastify";

const isDevEnv = process.env.NODE_ENV === "development";

export async function registerCors(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: isDevEnv
      ? [`http://localhost:${env.PORT}`, "http://127.0.0.1:3000", env.FRONTEND_URL]
      : [env.FRONTEND_URL],
    credentials: true,
  });
}
