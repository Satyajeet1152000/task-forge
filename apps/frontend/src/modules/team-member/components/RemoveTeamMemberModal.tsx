"use client";

import type { TeamMemberUser } from "@task-forge/shared/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RemoveTeamMemberModalProps {
  open: boolean;
  member: TeamMemberUser | null;
  isRemoving: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const RemoveTeamMemberModal: React.FC<RemoveTeamMemberModalProps> = ({
  open,
  member,
  isRemoving,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove team member?</DialogTitle>
          <DialogDescription>
            {member
              ? `${member.name} will be removed from your team and unassigned from all tasks you created. This action cannot be undone.`
              : "This member will be removed from your team and unassigned from all tasks you created."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRemoving}
          >
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isRemoving}>
            {isRemoving ? "Removing..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveTeamMemberModal;
