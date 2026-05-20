"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  acceptMemberInvite,
  createMemberInvite,
  fetchMemberInviteByCode,
  fetchTeamMembers,
  removeTeamMember,
  validateMemberInvite,
} from "./team-member.api";

import { TASK_KEYS } from "@/modules/task";

export const TEAM_MEMBER_KEYS = {
  all: ["team-members"] as const,
  invite: (code: string) => ["team-members", "invite", code] as const,
};

export function useTeamMembers() {
  return useQuery({
    queryKey: TEAM_MEMBER_KEYS.all,
    queryFn: fetchTeamMembers,
  });
}

export function useMemberInvite(code: string) {
  return useQuery({
    queryKey: TEAM_MEMBER_KEYS.invite(code),
    queryFn: () => fetchMemberInviteByCode(code),
    enabled: !!code,
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

export function useCreateMemberInvite() {
  return useMutation({
    mutationFn: createMemberInvite,
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create invite");
    },
  });
}

export function useValidateMemberInvite(code: string) {
  return useMutation({
    mutationFn: (email: string) => validateMemberInvite(code, { email }),
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to validate invite");
    },
  });
}

export function useAcceptMemberInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, email }: { code: string; email?: string }) =>
      acceptMemberInvite(code, email ? { email } : { email: "" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TEAM_MEMBER_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      toast.success("You have joined the team");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to join team");
    },
  });
}
