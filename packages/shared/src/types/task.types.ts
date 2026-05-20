import type { z } from "zod";

import type {
  createTaskBodySchema,
  subTaskInputSchema,
  subTaskSchema,
  taskListDataSchema,
  taskMemberSummarySchema,
  taskParamsSchema,
  subTaskParamsSchema,
  taskSchema,
  tasksListDataSchema,
  updateSubTaskCompletionBodySchema,
  updateTaskBodySchema,
} from "../schemas/task.schema";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export type SubTask = z.infer<typeof subTaskSchema>;

export type SubTaskInput = z.infer<typeof subTaskInputSchema>;

export type Task = z.infer<typeof taskSchema>;

export type TaskMemberSummary = z.infer<typeof taskMemberSummarySchema>;

export type TasksListData = z.infer<typeof tasksListDataSchema>;

export type TaskListData = z.infer<typeof taskListDataSchema>;

export type CreateTaskInput = z.infer<typeof createTaskBodySchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskBodySchema>;

export type UpdateSubTaskCompletionInput = z.infer<typeof updateSubTaskCompletionBodySchema>;

export type TaskParams = z.infer<typeof taskParamsSchema>;

export type SubTaskParams = z.infer<typeof subTaskParamsSchema>;

export interface GetAllTasksParams {
  userId: number;
}

export interface GetTaskByIdParams {
  taskId: number;
  userId: number;
}

export interface CreateTaskParams extends CreateTaskInput {
  userId: number;
}

export interface UpdateTaskParams {
  taskId: number;
  userId: number;
  input: UpdateTaskInput;
}

export interface DeleteTaskParams {
  taskId: number;
  userId: number;
}
