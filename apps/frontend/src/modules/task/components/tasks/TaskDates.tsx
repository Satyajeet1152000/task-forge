"use client";

import { formatTaskDate } from "../../task.utils";

interface TaskDatesProps {
  createdAt: string;
  dueDate: string | null;
}

const TaskDates: React.FC<TaskDatesProps> = ({ createdAt, dueDate }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs text-slate-500">Created Date</p>
        <p className="text-sm font-semibold text-slate-900">{formatTaskDate(createdAt)}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500">Due Date</p>
        <p className="text-sm font-semibold text-slate-900">{formatTaskDate(dueDate)}</p>
      </div>
    </div>
  );
};

export default TaskDates;
