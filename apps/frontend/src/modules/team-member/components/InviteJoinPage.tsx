"use client";

import { Icon } from "@iconify/react";
import { Routes } from "@task-forge/shared/constant";
import type { MemberInvitePreview } from "@task-forge/shared/types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useAcceptMemberInvite } from "../team-member.queries";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface InviteJoinPageProps {
  code: string;
  invite: MemberInvitePreview | null;
  userEmail: string;
}

function formatExpirationDate(expiresAt: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(expiresAt));
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const InviteJoinPage: React.FC<InviteJoinPageProps> = ({ code, invite, userEmail }) => {
  const router = useRouter();
  const acceptMutation = useAcceptMemberInvite();

  const completeJoin = useCallback(async (): Promise<void> => {
    const email = userEmail.trim().toLowerCase();
    await acceptMutation.mutateAsync({ code, email });
    router.push(Routes.DASHBOARD);
    router.refresh();
  }, [acceptMutation, code, router, userEmail]);

  if (!invite) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <Icon icon="mdi:link-off" className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Invite not found</h1>
          <p className="mt-2 text-sm text-slate-600">
            This invite link is invalid or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  if (acceptMutation.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Icon icon="mdi:loading" className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <InviteJoinCard
        invite={invite}
        userEmail={userEmail}
        isSubmitting={acceptMutation.isPending}
        onJoin={() => void completeJoin()}
      />
    </div>
  );
};

interface InviteJoinCardProps {
  invite: MemberInvitePreview;
  userEmail: string;
  isSubmitting: boolean;
  onJoin: () => void;
}

const InviteJoinCard: React.FC<InviteJoinCardProps> = ({
  invite,
  userEmail,
  isSubmitting,
  onJoin,
}) => {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={invite.inviter.image ?? undefined} alt={invite.inviter.name} />
          <AvatarFallback>{getInitials(invite.inviter.name)}</AvatarFallback>
        </Avatar>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Join the team</h1>
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-medium text-slate-900">{invite.inviter.name}</span> invited you to
          collaborate on Task Forge.
        </p>
        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          <Icon icon="mdi:clock-outline" className="h-4 w-4" />
          Expires {formatExpirationDate(invite.expiresAt)}
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {userEmail}
        </div>
        <Button type="button" className="h-11 w-full" disabled={isSubmitting} onClick={onJoin}>
          {isSubmitting ? (
            <>
              <Icon icon="mdi:loading" className="mr-2 h-5 w-5 animate-spin" />
              Joining...
            </>
          ) : (
            "Join"
          )}
        </Button>
      </div>
    </div>
  );
};

export default InviteJoinPage;
