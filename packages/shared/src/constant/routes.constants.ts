export enum Routes {
  DASHBOARD = "/dashboard",
  LOGIN = "/login",
  SIGNUP = "/signup",
  TASKS = "/tasks",
  CREATE_TASK = "/task/create-task",
  TASK_DETAILS = "/task/:id",
  TEAM_MEMBERS = "/team-members",
  INVITE = "/invite",
}

export const NAV_ITEMS: { href: string; label: string; icon: string }[] = [
  {
    href: Routes.DASHBOARD,
    label: "Dashboard",
    icon: "material-symbols:dashboard-outline-rounded",
  },
  {
    href: Routes.TASKS,
    label: "Manage Tasks",
    icon: "fluent:notepad-24-regular",
  },
  {
    href: Routes.CREATE_TASK,
    label: "Create Task",
    icon: "tabler:square-plus",
  },
  {
    href: Routes.TEAM_MEMBERS,
    label: "Team Members",
    icon: "lucide:users",
  },
];
