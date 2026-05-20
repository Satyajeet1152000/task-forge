import type { SubTask } from "@task-forge/shared/types";
import { TaskStatus } from "@task-forge/shared/types";

export function deriveTaskStatusFromSubTasks(subTasks: SubTask[]): TaskStatus {
  if (subTasks.length === 0) {
    return TaskStatus.PENDING;
  }

  const completedCount = subTasks.filter((subTask) => subTask.isCompleted).length;

  if (completedCount === 0) {
    return TaskStatus.PENDING;
  }

  if (completedCount === subTasks.length) {
    return TaskStatus.COMPLETED;
  }

  return TaskStatus.IN_PROGRESS;
}
