import type {
  ApiResponse,
  CreateTaskInput,
  Task,
  TaskListData,
  TasksListData,
  UpdateTaskInput,
  UpdateSubTaskCompletionInput,
} from "@task-forge/shared/types";

import { apiClient } from "@/lib/axios";

export async function fetchTasks(): Promise<TasksListData> {
  const { data } = await apiClient.get<ApiResponse<TasksListData>>("/tasks");

  if (!data.data) {
    throw new Error("Failed to load tasks");
  }

  return data.data;
}

export async function fetchTaskById(taskId: number): Promise<TaskListData> {
  const { data } = await apiClient.get<ApiResponse<TaskListData>>(`/tasks/${taskId}`);

  if (!data.data) {
    throw new Error("Failed to load task");
  }

  return data.data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data } = await apiClient.post<ApiResponse<Task>>("/tasks", input);

  if (!data.data) {
    throw new Error("Failed to create task");
  }

  return data.data;
}

export async function updateTask(taskId: number, input: UpdateTaskInput): Promise<Task> {
  const { data } = await apiClient.put<ApiResponse<Task>>(`/tasks/${taskId}`, input);

  if (!data.data) {
    throw new Error("Failed to update task");
  }

  return data.data;
}

export async function deleteTask(taskId: number): Promise<void> {
  await apiClient.delete(`/tasks/${taskId}`);
}

export async function updateSubTaskCompletion(
  taskId: number,
  subTaskId: number,
  input: UpdateSubTaskCompletionInput,
): Promise<TaskListData> {
  const { data } = await apiClient.patch<ApiResponse<TaskListData>>(
    `/tasks/${taskId}/sub-tasks/${subTaskId}`,
    input,
  );

  if (!data.data) {
    throw new Error("Failed to update subtask");
  }

  return data.data;
}
