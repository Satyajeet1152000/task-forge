"use client";

import type { SubTask } from "@task-forge/shared/types";

import { useUpdateSubTaskCompletion } from "../../task.queries";

interface UseTaskViewModalParams {
  taskId: number;
  currentUserId: number | null;
}

export function useTaskViewModal({ taskId, currentUserId }: UseTaskViewModalParams) {
  const updateSubTaskMutation = useUpdateSubTaskCompletion(taskId);

  const handleSubTaskToggle = (subTask: SubTask, isCompleted: boolean): void => {
    updateSubTaskMutation.mutate({
      subTaskId: subTask.id,
      input: { isCompleted },
    });
  };

  const isAssignedMember = (assignedMemberIds: number[]): boolean => {
    if (currentUserId === null) {
      return false;
    }

    return assignedMemberIds.includes(currentUserId);
  };

  return {
    handleSubTaskToggle,
    isAssignedMember,
    isUpdatingSubTask: updateSubTaskMutation.isPending,
  };
}
