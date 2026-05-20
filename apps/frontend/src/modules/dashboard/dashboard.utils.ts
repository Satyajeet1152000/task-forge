import { TaskPriority, TaskStatus, type Task } from "@task-forge/shared/types";

import { formatTaskDate } from "@/modules/task/task.utils";

export interface DashboardTaskCounts {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface DashboardStatusChartItem {
  status: string;
  count: number;
  fill: string;
}

export interface DashboardPriorityChartItem {
  priority: string;
  count: number;
  fill: string;
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good Morning";
  }
  if (hour < 17) {
    return "Good Afternoon";
  }
  return "Good Evening";
}

export function formatDashboardDate(date: Date = new Date()): string {
  const weekday = date.toLocaleString("en-US", { weekday: "long" });
  const day = date.getDate();
  const suffix = getDaySuffix(day);
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${weekday} ${day}${suffix} ${month} ${year}`;
}

export function getDashboardTaskCounts(tasks: Task[]): DashboardTaskCounts {
  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === TaskStatus.PENDING).length,
    inProgress: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
    completed: tasks.filter((task) => task.status === TaskStatus.COMPLETED).length,
  };
}

export function getStatusChartData(counts: DashboardTaskCounts): DashboardStatusChartItem[] {
  return [
    { status: "pending", count: counts.pending, fill: "var(--color-pending)" },
    { status: "inProgress", count: counts.inProgress, fill: "var(--color-inProgress)" },
    { status: "completed", count: counts.completed, fill: "var(--color-completed)" },
  ].filter((item) => item.count > 0);
}

export function getPriorityChartData(tasks: Task[]): DashboardPriorityChartItem[] {
  const lowCount = tasks.filter((task) => task.priority === TaskPriority.LOW).length;
  const mediumCount = tasks.filter((task) => task.priority === TaskPriority.MEDIUM).length;
  const highCount = tasks.filter((task) => task.priority === TaskPriority.HIGH).length;

  return [
    { priority: "low", count: lowCount, fill: "var(--color-low)" },
    { priority: "medium", count: mediumCount, fill: "var(--color-medium)" },
    { priority: "high", count: highCount, fill: "var(--color-high)" },
  ];
}

export function getRecentTasks(tasks: Task[], limit = 10): Task[] {
  return [...tasks]
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
    .slice(0, limit);
}

export function formatTaskCreatedDate(isoDate: string): string {
  return formatTaskDate(isoDate);
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
