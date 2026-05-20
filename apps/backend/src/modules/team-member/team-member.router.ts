import { requireAuth } from "@middleware/require-auth";
import {
  deleteRemoveTeamMemberRouteSchema,
  getTeamMembersRouteSchema,
  postAddTeamMemberRouteSchema,
} from "@task-forge/shared/schemas";
import { RouterConfig } from "@task-forge/shared/types";
import type { FastifyPluginAsync } from "fastify";

import { TeamMemberController } from "./team-member.controller";

const teamMemberRouter: FastifyPluginAsync = async (app) => {
  const controller = new TeamMemberController();
  const authenticate = { preHandler: [requireAuth] };

  app.get("/", { schema: getTeamMembersRouteSchema, ...authenticate }, controller.getAll);
  app.post("/", { schema: postAddTeamMemberRouteSchema, ...authenticate }, controller.addMember);
  app.delete(
    "/:memberId",
    { schema: deleteRemoveTeamMemberRouteSchema, ...authenticate },
    controller.removeMember,
  );
};

export const teamMemberRouteConfig: RouterConfig = {
  endpoint: "/team-members",
  router: teamMemberRouter,
};
