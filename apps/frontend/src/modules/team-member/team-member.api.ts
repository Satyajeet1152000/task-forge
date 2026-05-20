import type { ApiResponse, TeamMembersList } from "@task-forge/shared/types";

import { apiClient } from "@/lib/axios";

export async function fetchTeamMembers(): Promise<TeamMembersList> {
  const { data } = await apiClient.get<ApiResponse<TeamMembersList>>("/team-members");

  if (!data.data) {
    throw new Error("Failed to load team members");
  }

  return data.data;
}
