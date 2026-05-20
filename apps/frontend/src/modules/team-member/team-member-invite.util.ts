import { toast } from "sonner";

import { acceptMemberInvite } from "./team-member.api";

interface ContinueInviteParams {
  inviteCode?: string;
  email?: string;
}

export async function continueTeamInviteAfterAuth(params: ContinueInviteParams): Promise<boolean> {
  const inviteCode = params.inviteCode?.trim();
  if (!inviteCode) {
    return false;
  }

  const email = params.email?.trim().toLowerCase();

  await acceptMemberInvite(inviteCode, email ? { email } : { email: "" });
  toast.success("You have joined the team");

  return true;
}
