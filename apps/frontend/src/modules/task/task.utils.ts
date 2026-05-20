import { TaskPriority, TaskStatus } from "@task-forge/shared/types";

export type TaskFilterKey = "ALL" | TaskStatus;

export interface TaskStatusStyle {
  label: string;
  tagClass: string;
  accentClass: string;
}

export interface TaskPriorityStyle {
  label: string;
  tagClass: string;
}

export const TASK_STATUS_STYLES: Record<TaskStatus, TaskStatusStyle> = {
  [TaskStatus.PENDING]: {
    label: "Pending",
    tagClass: "bg-purple-100 text-purple-700",
    accentClass: "bg-purple-500",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    tagClass: "bg-cyan-100 text-cyan-700",
    accentClass: "bg-cyan-500",
  },
  [TaskStatus.COMPLETED]: {
    label: "Completed",
    tagClass: "bg-green-100 text-green-700",
    accentClass: "bg-green-500",
  },
};

export const TASK_PRIORITY_STYLES: Record<TaskPriority, TaskPriorityStyle> = {
  [TaskPriority.LOW]: {
    label: "Low Priority",
    tagClass: "bg-green-100 text-green-700",
  },
  [TaskPriority.MEDIUM]: {
    label: "Medium Priority",
    tagClass: "bg-amber-100 text-amber-700",
  },
  [TaskPriority.HIGH]: {
    label: "High Priority",
    tagClass: "bg-red-100 text-red-700",
  },
};

export function formatTaskDate(isoDate: string | null): string {
  if (!isoDate) {
    return "—";
  }
  const date = new Date(isoDate);
  const day = date.getDate();
  const suffix = getDaySuffix(day);
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day}${suffix} ${month} ${year}`;
}

export function getSubTaskProgress(subTasks: { isCompleted: boolean }[]): {
  completed: number;
  total: number;
  percent: number;
} {
  const total = subTasks.length;
  const completed = subTasks.filter((subTask) => subTask.isCompleted).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, percent };
}

function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
