import { authRouteConfig } from "@modules/auth";
import { healthRouteConfig } from "@modules/health";
import { memberInviteRouteConfig } from "@modules/member-invite";
import { taskRouteConfig } from "@modules/task";
import { teamMemberRouteConfig } from "@modules/team-member";
import { RouterConfig } from "@task-forge/shared/types";

export const routerConfigs: RouterConfig[] = [
  healthRouteConfig,
  authRouteConfig,
  taskRouteConfig,
  teamMemberRouteConfig,
  memberInviteRouteConfig,
];
