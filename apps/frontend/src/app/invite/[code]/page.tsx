import { redirect } from "next/navigation";

import { auth } from "@/modules/auth/auth";
import { buildLoginWithInviteRoute } from "@/modules/team-member";
import InviteJoinPage from "@/modules/team-member/components/InviteJoinPage";
import { fetchMemberInviteByCodeServer } from "@/modules/team-member/member-invite.server";

export default async function InvitePage(props: {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<React.ReactElement> {
  const { code } = await props.params;

  const invite = await fetchMemberInviteByCodeServer(code);

  if (!invite) {
    return <InviteJoinPage code={code} invite={null} userEmail="" />;
  }

  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginWithInviteRoute(code, invite?.email ?? undefined));
  }

  return <InviteJoinPage code={code} invite={invite} userEmail={session.user.email ?? ""} />;
}
