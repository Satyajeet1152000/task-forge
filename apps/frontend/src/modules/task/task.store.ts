import type { Task, TasksListData } from "@task-forge/shared/types";
import { create } from "zustand";

interface TaskStoreState {
  tasksListData: TasksListData | null;
  setTasksListData: (data: TasksListData) => void;
  getTaskById: (taskId: number) => Task | undefined;
  clearTasksListData: () => void;
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasksListData: null,
  setTasksListData: (data) => set({ tasksListData: data }),
  getTaskById: (taskId) => {
    const data = get().tasksListData;
    if (!data) {
      return undefined;
    }
    return data.tasks.find((task) => task.id === taskId);
  },
  clearTasksListData: () => set({ tasksListData: null }),
}));
