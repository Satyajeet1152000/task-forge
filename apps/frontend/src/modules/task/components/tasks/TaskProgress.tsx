"use client";

import type { SubTask } from "@task-forge/shared/types";

import { getSubTaskProgress } from "../../task.utils";

interface TaskProgressProps {
  subTasks: SubTask[];
}

const TaskProgress: React.FC<TaskProgressProps> = ({ subTasks }) => {
  if (subTasks.length === 0) {
    return null;
  }

  const { completed, total, percent } = getSubTaskProgress(subTasks);

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-600">
        Task Done: {completed} / {total}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-sky-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default TaskProgress;
