import { requireAuth } from "@middleware/require-auth";
import {
  getMemberInviteByCodeRouteSchema,
  postAcceptMemberInviteRouteSchema,
  postCreateMemberInviteRouteSchema,
  postValidateMemberInviteRouteSchema,
} from "@task-forge/shared/schemas";
import { RouterConfig } from "@task-forge/shared/types";
import type { FastifyPluginAsync } from "fastify";

import { MemberInviteController } from "./member-invite.controller";

const memberInviteRouter: FastifyPluginAsync = async (app) => {
  const controller = new MemberInviteController();
  const authenticate = { preHandler: [requireAuth] };

  app.post("/", { schema: postCreateMemberInviteRouteSchema, ...authenticate }, controller.createInvite);
  app.get("/:code", { schema: getMemberInviteByCodeRouteSchema }, controller.getInviteByCode);
  app.post("/:code/validate", { schema: postValidateMemberInviteRouteSchema }, controller.validateInvite);
  app.post(
    "/:code/accept",
    { schema: postAcceptMemberInviteRouteSchema, ...authenticate },
    controller.acceptInvite,
  );
};

export const memberInviteRouteConfig: RouterConfig = {
  endpoint: "/member-invites",
  router: memberInviteRouter,
};
