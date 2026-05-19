import type { FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId: number;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/request-context" {
  interface RequestContextData {
    requestId: string;
  }
}
