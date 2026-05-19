import { z } from "zod";

import { RouteTags } from "../types/swagger.types";

import { successResponseSchema } from "./common-schemas";

export const healthDataSchema = z.object({
  status: z.string(),
  message: z.string(),
  timestamp: z.string(),
  env: z.string().optional(),
  processName: z.string().optional(),
  uptime: z.number(),
  memoryUsage: z.record(z.unknown()),
  cpuUsage: z.record(z.unknown()),
  process: z.number(),
});

export const getHealthRouteSchema = {
  tags: [RouteTags.HEALTH],
  summary: "Health Check",
  description: "Returns process health metadata (no database in task forge).",
  response: {
    200: successResponseSchema(healthDataSchema),
  },
};
