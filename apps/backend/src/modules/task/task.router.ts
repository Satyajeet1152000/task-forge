import { requireAuth } from "@middleware/require-auth";
import {
  deleteTaskRouteSchema,
  getTaskByIdRouteSchema,
  getTasksRouteSchema,
  postCreateTaskRouteSchema,
  putUpdateTaskRouteSchema,
} from "@task-forge/shared/schemas";
import { RouterConfig } from "@task-forge/shared/types";
import type { FastifyPluginAsync } from "fastify";

import { TaskController } from "./task.controller";

const taskRouter: FastifyPluginAsync = async (app) => {
  const controller = new TaskController();
  const authenticate = { preHandler: [requireAuth] };

  app.post("/", { schema: postCreateTaskRouteSchema, ...authenticate }, controller.create);
  app.get("/", { schema: getTasksRouteSchema, ...authenticate }, controller.getAll);
  app.get("/:id", { schema: getTaskByIdRouteSchema, ...authenticate }, controller.getById);
  app.put("/:id", { schema: putUpdateTaskRouteSchema, ...authenticate }, controller.update);
  app.delete("/:id", { schema: deleteTaskRouteSchema, ...authenticate }, controller.delete);
};

export const taskRouteConfig: RouterConfig = {
  endpoint: "/tasks",
  router: taskRouter,
};
