"use client";

import { TaskStatus } from "@task-forge/shared/types";

import type { TaskFilterKey } from "../../task.utils";
import { TASK_STATUS_STYLES } from "../../task.utils";

import { cn } from "@/lib/utils";

interface TaskFilterTabsProps {
  activeFilter: TaskFilterKey;
  counts: Record<TaskFilterKey, number>;
  onChange: (filter: TaskFilterKey) => void;
}

const FILTERS: { key: TaskFilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: TaskStatus.PENDING, label: TASK_STATUS_STYLES[TaskStatus.PENDING].label },
  { key: TaskStatus.IN_PROGRESS, label: TASK_STATUS_STYLES[TaskStatus.IN_PROGRESS].label },
  { key: TaskStatus.COMPLETED, label: TASK_STATUS_STYLES[TaskStatus.COMPLETED].label },
];

const TaskFilterTabs: React.FC<TaskFilterTabsProps> = ({ activeFilter, counts, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-slate-200">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.key;

        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onChange(filter.key)}
            className={cn(
              "flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors",
              isActive
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-slate-500 hover:text-slate-700",
            )}
          >
            {filter.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                isActive ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600",
              )}
            >
              {counts[filter.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TaskFilterTabs;
