"use client";

import { useMemo } from "react";

import {
  getDashboardTaskCounts,
  getPriorityChartData,
  getRecentTasks,
  getStatusChartData,
} from "../dashboard.utils";

import DashboardCharts from "./DashboardCharts";
import DashboardGreetingCard from "./DashboardGreetingCard";
import DashboardRecentTasks from "./DashboardRecentTasks";
import DashboardSkeleton from "./DashboardSkeleton";

import { useAuth } from "@/modules/auth/use-auth";
import { useTasks } from "@/modules/task/task.queries";

const DashboardIndex: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useTasks();

  const tasks = useMemo(() => data?.tasks ?? [], [data?.tasks]);
  const counts = useMemo(() => getDashboardTaskCounts(tasks), [tasks]);
  const statusChartData = useMemo(() => getStatusChartData(counts), [counts]);
  const priorityChartData = useMemo(() => getPriorityChartData(tasks), [tasks]);
  const recentTasks = useMemo(() => getRecentTasks(tasks), [tasks]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Failed to load dashboard. Please try again.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardGreetingCard userName={user?.name ?? ""} counts={counts} />
      <DashboardCharts statusData={statusChartData} priorityData={priorityChartData} />
      <DashboardRecentTasks tasks={recentTasks} />
    </div>
  );
};

export default DashboardIndex;
