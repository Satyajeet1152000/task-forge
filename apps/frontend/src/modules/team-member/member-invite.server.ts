import type { ApiResponse, MemberInvitePreview } from "@task-forge/shared/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function fetchMemberInviteByCodeServer(
  code: string,
): Promise<MemberInvitePreview | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/member-invites/${code}`, {
      cache: "no-store",
    });

    const body = (await response.json()) as ApiResponse<MemberInvitePreview>;

    if (!response.ok || !body.success || !body.data) {
      return null;
    }

    return body.data;
  } catch {
    return null;
  }
}
