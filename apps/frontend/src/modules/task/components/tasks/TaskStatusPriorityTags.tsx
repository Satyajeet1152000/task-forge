"use client";

import type { Task } from "@task-forge/shared/types";

import { TASK_PRIORITY_STYLES, TASK_STATUS_STYLES } from "../../task.utils";

interface TaskStatusPriorityTagsProps {
  status: Task["status"];
  priority: Task["priority"];
}

const TaskStatusPriorityTags: React.FC<TaskStatusPriorityTagsProps> = ({ status, priority }) => {
  const statusStyle = TASK_STATUS_STYLES[status];
  const priorityStyle = TASK_PRIORITY_STYLES[priority];

  return (
    <div className="flex flex-wrap gap-2">
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.tagClass}`}>
        {statusStyle.label}
      </span>
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyle.tagClass}`}>
        {priorityStyle.label}
      </span>
    </div>
  );
};

export default TaskStatusPriorityTags;
