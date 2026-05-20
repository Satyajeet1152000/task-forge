import { TeamMemberTaskStats } from "../types";

export const EMPTY_TEAM_MEMBER_TASK_STATS: TeamMemberTaskStats = {
  pending: 0,
  inProgress: 0,
  completed: 0,
};

export const TEAM_MEMBER_STAT_STYLES = {
  pending: {
    valueClass: "text-purple-600",
    labelClass: "text-purple-400",
  },
  inProgress: {
    valueClass: "text-cyan-500",
    labelClass: "text-cyan-400",
  },
  completed: {
    valueClass: "text-blue-500",
    labelClass: "text-blue-400",
  },
} as const;
