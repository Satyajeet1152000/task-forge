import type { SubTaskInput } from "./task.types";

export interface CreateSubTasksForTaskParams {
  taskId: number;
  userId: number;
  subTasks: SubTaskInput[];
}

export interface GetSubTasksByTaskIdParams {
  taskId: number;
  userId: number;
}

export interface GetSubTasksByTaskIdsParams {
  taskIds: number[];
}

export interface DeleteSubTasksByTaskIdParams {
  taskId: number;
  userId: number;
}

export interface UpdateSubTaskCompletionParams {
  taskId: number;
  subTaskId: number;
  userId: number;
  isCompleted: boolean;
}
