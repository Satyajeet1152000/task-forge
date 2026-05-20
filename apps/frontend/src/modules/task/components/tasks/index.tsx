"use client";

import { Routes } from "@task-forge/shared/constant";
import type { Task } from "@task-forge/shared/types";
import { TaskStatus } from "@task-forge/shared/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useTasks } from "../../task.queries";
import type { TaskFilterKey } from "../../task.utils";

import TaskCard from "./TaskCard";
import TaskCardSkeleton from "./TaskCardSkeleton";
import TaskEmptyState from "./TaskEmptyState";
import TaskFilterTabs from "./TaskFilterTabs";
import TaskViewModal from "./TaskViewModal";

import { useAuth } from "@/modules/auth/use-auth";

const TasksIndex: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<TaskFilterKey>("ALL");
  const [viewTaskId, setViewTaskId] = useState<number | null>(null);
  const { data, isLoading, isError } = useTasks();

  const currentUserId = user?.id ? Number(user.id) : null;
  const tasks = useMemo(() => data?.tasks ?? [], [data?.tasks]);
  const assignedMembers = data?.assignedMembers ?? {};

  const counts = useMemo((): Record<TaskFilterKey, number> => {
    return {
      ALL: tasks.length,
      [TaskStatus.PENDING]: tasks.filter((task) => task.status === TaskStatus.PENDING).length,
      [TaskStatus.IN_PROGRESS]: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS)
        .length,
      [TaskStatus.COMPLETED]: tasks.filter((task) => task.status === TaskStatus.COMPLETED).length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (activeFilter === "ALL") {
      return tasks;
    }
    return tasks.filter((task) => task.status === activeFilter);
  }, [tasks, activeFilter]);

  const handleTaskClick = (task: Task): void => {
    if (currentUserId !== null && task.userId !== currentUserId) {
      setViewTaskId(task.id);
      return;
    }

    router.push(Routes.TASK_DETAILS.replace(":id", String(task.id)));
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
        <TaskFilterTabs activeFilter={activeFilter} counts={counts} onChange={setActiveFilter} />
      </div>

      {isError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load tasks. Please try again.
        </p>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && !isError && filteredTasks.length === 0 && <TaskEmptyState />}

      {!isLoading && !isError && filteredTasks.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assignedMembers={assignedMembers}
              onClick={handleTaskClick}
            />
          ))}
        </div>
      )}

      <TaskViewModal
        taskId={viewTaskId}
        open={viewTaskId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setViewTaskId(null);
          }
        }}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default TasksIndex;
