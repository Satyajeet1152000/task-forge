import { authRouteConfig } from "@modules/auth";
import { healthRouteConfig } from "@modules/health";
import { RouterConfig } from "@task-forge/shared/types";

export const routerConfigs: RouterConfig[] = [healthRouteConfig, authRouteConfig];
