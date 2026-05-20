import type {
  TaskMemberSummary,
  TeamMemberTaskStats,
  TeamMemberUser,
  TeamMembersList,
} from "@task-forge/shared/types";

const EMPTY_TASK_STATS: TeamMemberTaskStats = {
  pending: 0,
  inProgress: 0,
  completed: 0,
};

export const serializeTeamMemberUser = (
  member: TaskMemberSummary,
  taskStats: TeamMemberTaskStats = EMPTY_TASK_STATS,
): TeamMemberUser => {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    image: member.image,
    taskStats,
  };
};

export const serializeTeamMembersList = (
  members: TaskMemberSummary[],
  statsByMemberId: Record<number, TeamMemberTaskStats> = {},
): TeamMembersList => {
  return {
    members: members.map((member) =>
      serializeTeamMemberUser(member, statsByMemberId[member.id] ?? EMPTY_TASK_STATS),
    ),
  };
};
