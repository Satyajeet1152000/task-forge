import type { SubTask } from "@task-forge/shared/types";

import { SubTaskEntity } from "./sub-task.entity";

export const serializeSubTask = (subTask: SubTaskEntity): SubTask => {
  return {
    id: Number(subTask.id),
    userId: Number(subTask.userId),
    taskId: Number(subTask.taskId),
    title: subTask.title,
    isCompleted: subTask.isCompleted,
    createdAt: subTask.createdAt.toISOString(),
    updatedAt: subTask.updatedAt.toISOString(),
  };
};
