"use client";

import { Icon } from "@iconify/react";
import type { Task, TaskMemberSummary } from "@task-forge/shared/types";

import { TASK_STATUS_STYLES } from "../../task.utils";

import MemberAvatars from "./MemberAvatars";
import TaskDates from "./TaskDates";
import TaskProgress from "./TaskProgress";
import TaskStatusPriorityTags from "./TaskStatusPriorityTags";

import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  assignedMembers: Record<string, TaskMemberSummary>;
  onClick: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, assignedMembers, onClick }) => {
  const statusStyle = TASK_STATUS_STYLES[task.status];
  const attachmentCount = task.attachments.length;

  return (
    <button
      type="button"
      onClick={() => onClick(task.id)}
      className="flex w-full cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className={cn("w-1 shrink-0", statusStyle.accentClass)} />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <TaskStatusPriorityTags status={task.status} priority={task.priority} />
        <div>
          <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description}</p>
          )}
        </div>
        <TaskProgress subTasks={task.subTasks} />
        <TaskDates startDate={task.startDate} dueDate={task.dueDate} />
        <div className="flex items-center justify-between">
          <MemberAvatars
            memberIds={task.assignedMembers}
            assignedMembers={assignedMembers}
            maxVisible={3}
          />
          {attachmentCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
              <Icon icon="mdi:paperclip" className="h-3.5 w-3.5" />
              {attachmentCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default TaskCard;
