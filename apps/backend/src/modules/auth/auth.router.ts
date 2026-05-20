import {
  getMeRouteSchema,
  postGoogleAuthRouteSchema,
  postLoginRouteSchema,
  postLogoutRouteSchema,
  postSignupRouteSchema,
} from "@task-forge/shared/schemas";
import { RouterConfig } from "@task-forge/shared/types";
import type { FastifyPluginAsync } from "fastify";

import { AuthController } from "./auth.controller";

const authRouter: FastifyPluginAsync = async (app) => {
  const controller = new AuthController();

  app.post("/signup", { schema: postSignupRouteSchema }, controller.signup);
  app.post("/login", { schema: postLoginRouteSchema }, controller.login);
  app.post("/google", { schema: postGoogleAuthRouteSchema }, controller.googleAuth);
  app.post("/logout", { schema: postLogoutRouteSchema }, controller.logout);
  app.get("/me", { schema: getMeRouteSchema, preHandler: [app.authenticate] }, controller.me);
};

export const authRouteConfig: RouterConfig = {
  endpoint: "/auth",
  router: authRouter,
};
