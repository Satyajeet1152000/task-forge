"use client";

import { Icon } from "@iconify/react";
import type { TeamMemberUser } from "@task-forge/shared/types";
import Image from "next/image";

import { TEAM_MEMBER_STAT_STYLES } from "../team-member.utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TeamMemberCardProps {
  member: TeamMemberUser;
  onRemove: (member: TeamMemberUser) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onRemove }) => {
  const initials = member.name.charAt(0).toUpperCase();
  const { pending, inProgress, completed } = member.taskStats;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0 bg-slate-200">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="text-base font-semibold">{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900">{member.name}</h3>
            <p className="truncate text-sm text-slate-500">{member.email}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
          onClick={() => onRemove(member)}
          aria-label={`Remove ${member.name}`}
        >
          <Icon icon="mdi:trash-can-outline" className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-100 px-2 py-4">
        <div className="flex flex-col items-center gap-1 px-2">
          <span className={`text-2xl font-bold ${TEAM_MEMBER_STAT_STYLES.pending.valueClass}`}>
            {pending}
          </span>
          <span className={`text-sm ${TEAM_MEMBER_STAT_STYLES.pending.labelClass}`}>Pending</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2">
          <span className={`text-2xl font-bold ${TEAM_MEMBER_STAT_STYLES.inProgress.valueClass}`}>
            {inProgress}
          </span>
          <span className={`text-sm ${TEAM_MEMBER_STAT_STYLES.inProgress.labelClass}`}>
            In Progress
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2">
          <span className={`text-2xl font-bold ${TEAM_MEMBER_STAT_STYLES.completed.valueClass}`}>
            {completed}
          </span>
          <span className={`text-sm ${TEAM_MEMBER_STAT_STYLES.completed.labelClass}`}>
            Completed
          </span>
        </div>
      </div>
    </article>
  );
};

export default TeamMemberCard;
