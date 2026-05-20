"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Routes } from "@task-forge/shared/constant";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateSubTaskCompletionInput,
} from "@task-forge/shared/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createTask,
  deleteTask,
  fetchTaskById,
  fetchTasks,
  updateSubTaskCompletion,
  updateTask,
} from "./task.api";
import { useTaskStore } from "./task.store";

export const TASK_KEYS = {
  all: ["tasks"] as const,
  byId: (taskId: number) => ["tasks", taskId] as const,
};

export function useTasks() {
  const setTasksListData = useTaskStore((state) => state.setTasksListData);

  return useQuery({
    queryKey: TASK_KEYS.all,
    queryFn: async () => {
      const data = await fetchTasks();
      setTasksListData(data);

      return data;
    },
  });
}

export function useTask(taskId: number, enabled = true) {
  return useQuery({
    queryKey: TASK_KEYS.byId(taskId),
    queryFn: () => fetchTaskById(taskId),
    enabled: enabled && !Number.isNaN(taskId) && taskId > 0,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      toast.success("Task created successfully");
      router.push(Routes.TASKS);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create task");
    },
  });
}

export function useUpdateTask(taskId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: UpdateTaskInput) => updateTask(taskId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: TASK_KEYS.byId(taskId) });
      toast.success("Task updated successfully");
      router.push(Routes.TASKS);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update task");
    },
  });
}

export function useDeleteTask(taskId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      toast.success("Task deleted successfully");
      router.push(Routes.TASKS);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete task");
    },
  });
}

export function useUpdateSubTaskCompletion(taskId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subTaskId,
      input,
    }: {
      subTaskId: number;
      input: UpdateSubTaskCompletionInput;
    }) => updateSubTaskCompletion(taskId, subTaskId, input),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      void queryClient.setQueryData(TASK_KEYS.byId(taskId), data);
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update subtask");
    },
  });
}
