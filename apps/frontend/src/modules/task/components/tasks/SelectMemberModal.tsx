"use client";

import type { TeamMemberUser } from "@task-forge/shared/types";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SelectMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: TeamMemberUser[];
  selectedMemberIds: number[];
  onConfirm: (memberIds: number[]) => void;
}

const SelectMemberModal: React.FC<SelectMemberModalProps> = ({
  open,
  onOpenChange,
  members,
  selectedMemberIds,
  onConfirm,
}) => {
  const [draftSelectedIds, setDraftSelectedIds] = useState<number[]>(selectedMemberIds);

  useEffect(() => {
    if (open) {
      setDraftSelectedIds(selectedMemberIds);
    }
  }, [open, selectedMemberIds]);

  const toggleMember = (memberId: number): void => {
    setDraftSelectedIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    );
  };

  const handleConfirm = (): void => {
    onConfirm(draftSelectedIds);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-md overflow-hidden p-0">
        <DialogHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <DialogTitle className="text-lg font-semibold">Select member</DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto px-2 py-2">
          {members.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              No team members available. Add members from Team Members page first.
            </p>
          ) : (
            members.map((member) => {
              const isSelected = draftSelectedIds.includes(member.id);
              const initials = member.name.charAt(0).toUpperCase();

              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleMember(member.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-slate-50"
                >
                  <Avatar className="h-10 w-10">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AvatarFallback>{initials}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">{member.name}</p>
                    <p className="truncate text-sm text-slate-500">{member.email}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="h-4 w-4 rounded border-slate-300 text-sky-600"
                  />
                </button>
              );
            })
          )}
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectMemberModal;
