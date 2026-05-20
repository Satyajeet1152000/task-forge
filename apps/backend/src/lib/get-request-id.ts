import { randomUUID } from "node:crypto";

import { requestContext } from "@fastify/request-context";

export function getRequestId(): string {
  return requestContext.get("requestId") ?? randomUUID();
}
