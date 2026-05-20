import { UserRole } from "../types/auth.types";

export enum Routes {
  DASHBOARD = "/dashboard",
  LOGIN = "/login",
  SIGNUP = "/signup",
  TASKS = "/tasks",
  CREATE_TASK = "/task/create-task",
  TASK_DETAILS = "/task/:id",
  TEAM_MEMBERS = "/team-members",
}

export const NAV_ITEMS: { href: string; label: string; icon: string; userRoles: UserRole[] }[] = [
  {
    href: Routes.DASHBOARD,
    label: "Dashboard",
    icon: "material-symbols:dashboard-outline-rounded",
    userRoles: [UserRole.ADMIN, UserRole.USER],
  },
  {
    href: Routes.TASKS,
    label: "Manage Tasks",
    icon: "fluent:notepad-24-regular",
    userRoles: [UserRole.ADMIN, UserRole.USER],
  },
  {
    href: Routes.CREATE_TASK,
    label: "Create Task",
    icon: "tabler:square-plus",
    userRoles: [UserRole.ADMIN],
  },
  {
    href: Routes.TEAM_MEMBERS,
    label: "Team Members",
    icon: "lucide:users",
    userRoles: [UserRole.ADMIN],
  },
];
