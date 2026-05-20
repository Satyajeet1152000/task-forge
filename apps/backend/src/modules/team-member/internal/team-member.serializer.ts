import type { TeamMemberUser, TeamMembersList } from "@task-forge/shared/types";

export const serializeTeamMembersList = (members: TeamMemberUser[]): TeamMembersList => {
  return { members };
};
