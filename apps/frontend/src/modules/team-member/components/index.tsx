"use client";

import { Icon } from "@iconify/react";
import type { TeamMemberUser } from "@task-forge/shared/types";
import { useMemo, useState } from "react";

import { useRemoveTeamMember, useTeamMembers } from "../team-member.queries";

import InviteTeamMemberModal from "./InviteTeamMemberModal";
import RemoveTeamMemberModal from "./RemoveTeamMemberModal";
import TeamMemberCard from "./TeamMemberCard";
import TeamMemberCardSkeleton from "./TeamMemberCardSkeleton";
import TeamMemberEmptyState from "./TeamMemberEmptyState";

import { Button } from "@/components/ui/button";

const TeamMembersIndex: React.FC = () => {
  const { data, isLoading, isError } = useTeamMembers();
  const removeMutation = useRemoveTeamMember();
  const [memberToRemove, setMemberToRemove] = useState<TeamMemberUser | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const members = useMemo(() => data?.members ?? [], [data?.members]);

  const handleRemoveConfirm = (): void => {
    if (!memberToRemove) {
      return;
    }

    removeMutation.mutate(memberToRemove.id, {
      onSuccess: () => {
        setMemberToRemove(null);
      },
    });
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
        <Button
          type="button"
          className="bg-lime-200 text-slate-900 hover:bg-lime-300"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <Icon icon="mdi:account-plus-outline" className="mr-2 h-5 w-5" />
          Invite
        </Button>
      </div>

      {isError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load team members. Please try again.
        </p>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <TeamMemberCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && !isError && members.length === 0 && <TeamMemberEmptyState />}

      {!isLoading && !isError && members.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <TeamMemberCard key={member.id} member={member} onRemove={setMemberToRemove} />
          ))}
        </div>
      )}

      <RemoveTeamMemberModal
        open={memberToRemove !== null}
        member={memberToRemove}
        isRemoving={removeMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setMemberToRemove(null);
          }
        }}
        onConfirm={handleRemoveConfirm}
      />

      <InviteTeamMemberModal open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen} />
    </div>
  );
};

export default TeamMembersIndex;
