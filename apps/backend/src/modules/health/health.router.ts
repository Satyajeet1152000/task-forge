import { successResponse } from "@lib/api-response";
import { getHealthRouteSchema } from "@task-forge/shared/schemas";
import { RouterConfig } from "@task-forge/shared/types";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";

const healthRouter: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", { schema: getHealthRouteSchema }, async (_request, reply) => {
    return reply.status(200).send(
      successResponse({
        status: "Healthy",
        message: "Server is running",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        processName: process.env.APP_NAME,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage() as unknown as Record<string, unknown>,
        cpuUsage: process.cpuUsage() as unknown as Record<string, unknown>,
        process: process.pid,
      }),
    );
  });
};

export const healthRouteConfig: RouterConfig = {
  endpoint: "/health",
  router: healthRouter,
};
