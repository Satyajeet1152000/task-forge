"use client";

import { Icon } from "@iconify/react";
import { Routes } from "@task-forge/shared/constant";
import type { Task } from "@task-forge/shared/types";
import Link from "next/link";

import { formatTaskCreatedDate } from "../dashboard.utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TASK_PRIORITY_STYLES, TASK_STATUS_STYLES } from "@/modules/task/task.utils";

interface DashboardRecentTasksProps {
  tasks: Task[];
}

const PRIORITY_SHORT_LABELS: Record<Task["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const DashboardRecentTasks: React.FC<DashboardRecentTasksProps> = ({ tasks }) => {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900">Recent Tasks</CardTitle>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-lg bg-slate-100 text-slate-700"
          asChild
        >
          <Link href={Routes.TASKS}>
            Show All
            <Icon icon="mdi:arrow-right" className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {tasks.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-slate-500">No tasks created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-y border-slate-100 text-slate-500">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                  <th className="px-6 py-3 font-medium">Created On</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const statusStyle = TASK_STATUS_STYLES[task.status];
                  const priorityStyle = TASK_PRIORITY_STYLES[task.priority];

                  return (
                    <tr key={task.id} className="border-b border-slate-50 last:border-b-0">
                      <td className="px-6 py-4 font-medium text-slate-800">{task.title}</td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                            statusStyle.tagClass,
                          )}
                        >
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                            priorityStyle.tagClass,
                          )}
                        >
                          {PRIORITY_SHORT_LABELS[task.priority]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatTaskCreatedDate(task.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardRecentTasks;
