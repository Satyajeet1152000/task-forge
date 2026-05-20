"use client";

import { formatTaskDate } from "../../task.utils";

interface TaskDatesProps {
  startDate: string | null;
  dueDate: string | null;
}

const TaskDates: React.FC<TaskDatesProps> = ({ startDate, dueDate }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs text-slate-500">Start Date</p>
        <p className="text-sm font-semibold text-slate-900">{formatTaskDate(startDate)}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500">Due Date</p>
        <p className="text-sm font-semibold text-slate-900">{formatTaskDate(dueDate)}</p>
      </div>
    </div>
  );
};

export default TaskDates;
