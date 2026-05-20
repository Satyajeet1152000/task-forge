"use client";

import type { TaskMemberSummary } from "@task-forge/shared/types";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MemberAvatarsProps {
  memberIds: number[];
  assignedMembers: Record<string, TaskMemberSummary>;
  maxVisible?: number;
  className?: string;
}

const MemberAvatars: React.FC<MemberAvatarsProps> = ({
  memberIds,
  assignedMembers,
  maxVisible = 3,
  className,
}) => {
  if (memberIds.length === 0) {
    return null;
  }

  const visibleIds = memberIds.slice(0, maxVisible);
  const remainingCount = memberIds.length - visibleIds.length;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {visibleIds.map((memberId) => {
          const member = assignedMembers[String(memberId)];
          const initials = member?.name?.charAt(0).toUpperCase() ?? "?";

          return (
            <Avatar
              key={memberId}
              className="h-8 w-8 border-2 border-white bg-slate-200 text-xs font-medium text-slate-700"
            >
              {member?.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
          );
        })}
      </div>
      {remainingCount > 0 && (
        <span className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default MemberAvatars;
