import type {
  ApiResponse,
  CreatedMemberInvite,
  CreateMemberInviteInput,
  MemberInvitePreview,
  TeamMembersList,
  ValidateMemberInviteInput,
  ValidateMemberInviteResult,
} from "@task-forge/shared/types";

import { apiClient } from "@/lib/axios";

export async function fetchTeamMembers(): Promise<TeamMembersList> {
  const { data } = await apiClient.get<ApiResponse<TeamMembersList>>("/team-members");

  if (!data.data) {
    throw new Error("Failed to load team members");
  }

  return data.data;
}

export async function removeTeamMember(memberId: number): Promise<TeamMembersList> {
  const { data } = await apiClient.delete<ApiResponse<TeamMembersList>>(
    `/team-members/${memberId}`,
  );

  if (!data.data) {
    throw new Error("Failed to remove team member");
  }

  return data.data;
}

export async function createMemberInvite(
  input: CreateMemberInviteInput,
): Promise<CreatedMemberInvite> {
  const payload = {
    ...input,
    email: input.email?.trim().toLowerCase() ?? null,
  };

  const { data } = await apiClient.post<ApiResponse<CreatedMemberInvite>>("/member-invites", payload);

  if (!data.data) {
    throw new Error("Failed to create invite");
  }

  return data.data;
}

export async function fetchMemberInviteByCode(code: string): Promise<MemberInvitePreview> {
  const { data } = await apiClient.get<ApiResponse<MemberInvitePreview>>(`/member-invites/${code}`);

  if (!data.data) {
    throw new Error("Invite not found");
  }

  return data.data;
}

export async function validateMemberInvite(
  code: string,
  input: ValidateMemberInviteInput,
): Promise<ValidateMemberInviteResult> {
  const payload = {
    email: input.email.trim().toLowerCase(),
  };

  const { data } = await apiClient.post<ApiResponse<ValidateMemberInviteResult>>(
    `/member-invites/${code}/validate`,
    payload,
  );

  if (!data.data) {
    throw new Error("Failed to validate invite");
  }

  return data.data;
}

export async function acceptMemberInvite(
  code: string,
  input: ValidateMemberInviteInput = { email: "" },
): Promise<TeamMembersList> {
  const payload = input.email ? { email: input.email.trim().toLowerCase() } : {};

  const { data } = await apiClient.post<ApiResponse<TeamMembersList>>(
    `/member-invites/${code}/accept`,
    payload,
  );

  if (!data.data) {
    throw new Error("Failed to accept invite");
  }

  return data.data;
}
