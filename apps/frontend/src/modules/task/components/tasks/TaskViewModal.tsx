"use client";

import { Icon } from "@iconify/react";
import type { TaskListData } from "@task-forge/shared/types";

import MemberAvatars from "./MemberAvatars";
import TaskDates from "./TaskDates";
import TaskProgress from "./TaskProgress";
import TaskStatusPriorityTags from "./TaskStatusPriorityTags";
import { useTaskViewModal } from "./task-view-modal.hook";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTask } from "@/modules/task/task.queries";

interface TaskViewModalProps {
  taskId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: number | null;
}

const TaskViewModal: React.FC<TaskViewModalProps> = ({
  taskId,
  open,
  onOpenChange,
  currentUserId,
}) => {
  const resolvedTaskId = taskId ?? 0;
  const { data, isLoading, isError } = useTask(resolvedTaskId, open && taskId !== null);
  const { handleSubTaskToggle, isAssignedMember, isUpdatingSubTask } = useTaskViewModal({
    taskId: resolvedTaskId,
    currentUserId,
  });

  const taskData: TaskListData | undefined = data;
  const task = taskData?.task;
  const assignedMembers = taskData?.assignedMembers ?? {};
  const canEditSubTasks = task ? isAssignedMember(task.assignedMembers) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{task?.title ?? "Task Details"}</DialogTitle>
          <DialogDescription>
            {canEditSubTasks
              ? "Update checklist items to track your progress."
              : "View-only task details."}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading task...</p>
        )}

        {isError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load task. Please try again.
          </p>
        )}

        {!isLoading && !isError && task && (
          <div className="space-y-5">
            <TaskStatusPriorityTags status={task.status} priority={task.priority} />

            {task.description ? (
              <p className="text-sm leading-relaxed text-slate-600">{task.description}</p>
            ) : null}

            <TaskProgress subTasks={task.subTasks} />
            <TaskDates createdAt={task.createdAt} dueDate={task.dueDate} />

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">Assigned Members</p>
              <MemberAvatars
                memberIds={task.assignedMembers}
                assignedMembers={assignedMembers}
                maxVisible={5}
              />
            </div>

            {task.subTasks.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">Checklist</p>
                {task.subTasks.map((subTask) => (
                  <label
                    key={subTask.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2",
                      canEditSubTasks ? "cursor-pointer" : "cursor-default",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={subTask.isCompleted}
                      disabled={!canEditSubTasks || isUpdatingSubTask}
                      onChange={(event) => handleSubTaskToggle(subTask, event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 disabled:cursor-not-allowed"
                    />
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        subTask.isCompleted ? "text-slate-400 line-through" : "text-slate-800",
                      )}
                    >
                      {subTask.title}
                    </span>
                  </label>
                ))}
              </div>
            ) : null}

            {task.attachments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Attachments</p>
                <ul className="space-y-2">
                  {task.attachments.map((attachment) => (
                    <li key={attachment}>
                      <a
                        href={attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-sky-700 hover:underline"
                      >
                        <Icon icon="mdi:paperclip" className="h-4 w-4" />
                        {attachment}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewModal;
