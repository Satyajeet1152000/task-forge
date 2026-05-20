import "reflect-metadata";
import { randomUUID } from "node:crypto";

import AppDataSource from "@database/data-source";
import {
  registerCompress,
  registerErrorHandler,
  registerHelmet,
  registerRateLimit,
  registerSwagger,
} from "@plugins";
import { env } from "@task-forge/shared/env";
import Fastify, { type FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { loggerConfig } from "./lib/logger-config";
import { registerCors } from "./plugins/cors.plugin";
import { registerJwt } from "./plugins/jwt.plugin";
import { registerRequestContext } from "./plugins/request-context.plugin";
import { routerConfigs } from "./routers";

async function createServer(app: FastifyInstance): Promise<void> {
  if (env.NODE_ENV === "development") await registerSwagger(app);

  await registerCompress(app);
  await registerRequestContext(app);
  await registerHelmet(app);
  await registerCors(app);
  await registerJwt(app);
  await registerRateLimit(app);
  await registerErrorHandler(app);

  await app.register(
    async (instance) => {
      const zodInstance = instance.withTypeProvider<ZodTypeProvider>();
      routerConfigs.forEach(({ router, endpoint }) => {
        zodInstance.register(router, { prefix: endpoint });
      });
    },
    { prefix: "/api" },
  );
}

async function init(): Promise<void> {
  const app = Fastify({
    logger: loggerConfig,
    disableRequestLogging: true,
    genReqId: (req) => {
      return (req.headers["request-id"] as string) ?? randomUUID();
    },
    routerOptions: {
      ignoreDuplicateSlashes: true,
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setNotFoundHandler((request, reply) => {
    app.log.info(`Route not found - ${request.url}`);
    return reply.status(404).send({
      success: false,
      error: "Route not found",
      statusCode: 404,
    });
  });

  await createServer(app);

  app.addHook("onRequest", (req, reply, done) => {
    req.log.info(
      `${req.ip} - ${reply.statusCode} - ${req.method} ${req.url} - reqId: ${req.id} - ${req.headers["user-agent"]}`,
    );
    done();
  });

  const shutDown = async (signal: string): Promise<void> => {
    app.log.info(`Received ${signal}, shutting down gracefully…`);
    await app.close();
    process.exit(0);
  };
  process.on("SIGTERM", () => void shutDown("SIGTERM"));
  process.on("SIGINT", () => void shutDown("SIGINT"));

  await AppDataSource.initialize()
    .then(() => {
      app.log.info("connected with Database successfully");

      app
        .listen({ port: env.PORT, host: "0.0.0.0" })
        .then(() => {
          app.log.info("Server is ready");
        })
        .catch((err) => {
          app.log.error("app - error starting server - %s", err);
          AppDataSource.destroy()
            .then(() => {
              app.log.info("Database connection closed");
            })
            .catch((err) => {
              app.log.error("app - error closing database connection - %s", err);
            });
          process.exit(1);
        });
    })
    .catch((err) => {
      app.log.error("app - error connecting with Database - %s", err);
      process.exit(1);
    });
}

void init();
