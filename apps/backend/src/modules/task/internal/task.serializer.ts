import type { SubTask, Task } from "@task-forge/shared/types";

import { TaskEntity } from "./task.entity";

export const serializeTask = (task: TaskEntity, subTasks: SubTask[]): Task => {
  return {
    id: Number(task.id),
    userId: Number(task.userId),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    startDate: task.startDate ? task.startDate.toISOString() : null,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    subTasks,
    assignedMembers: task.assignedMembers.map((memberId) => Number(memberId)),
    attachments: task.attachments ?? [],
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
};
