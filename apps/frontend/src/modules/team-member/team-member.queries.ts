"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchTeamMembers } from "./team-member.api";

export const TEAM_MEMBER_KEYS = {
  all: ["team-members"] as const,
};

export function useTeamMembers() {
  return useQuery({
    queryKey: TEAM_MEMBER_KEYS.all,
    queryFn: fetchTeamMembers,
  });
}
