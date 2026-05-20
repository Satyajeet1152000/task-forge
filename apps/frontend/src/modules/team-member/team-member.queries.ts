"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchTeamMembers, removeTeamMember } from "./team-member.api";

import { TASK_KEYS } from "@/modules/task";

export const TEAM_MEMBER_KEYS = {
  all: ["team-members"] as const,
};

export function useTeamMembers() {
  return useQuery({
    queryKey: TEAM_MEMBER_KEYS.all,
    queryFn: fetchTeamMembers,
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) => removeTeamMember(memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TEAM_MEMBER_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      toast.success("Team member removed");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to remove team member");
    },
  });
}
