"use client";

import { Icon } from "@iconify/react";
import { Routes } from "@task-forge/shared/constant";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const TaskEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <Icon icon="fluent:notepad-24-regular" className="mb-4 h-12 w-12 text-slate-300" />
      <h3 className="text-lg font-semibold text-slate-900">No tasks yet</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        You do not have any tasks matching this filter. Create a new task to get started.
      </p>
      <Button asChild className="mt-6">
        <Link href={Routes.CREATE_TASK}>Create Task</Link>
      </Button>
    </div>
  );
};

export default TaskEmptyState;
