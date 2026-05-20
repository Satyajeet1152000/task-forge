"use client";

import { Icon } from "@iconify/react";
import { Routes } from "@task-forge/shared/constant";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { TaskFormPage, useTaskStore, useTasks } from "@/modules/task";

const TaskDetailsPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const taskId = Number(params.id);
  const { data, isLoading } = useTasks();
  const getTaskById = useTaskStore((state) => state.getTaskById);

  const task = getTaskById(taskId) ?? data?.tasks.find((item) => item.id === taskId);

  useEffect(() => {
    if (!isLoading && data && !task && !Number.isNaN(taskId)) {
      router.replace(Routes.TASKS);
    }
  }, [isLoading, data, task, taskId, router]);

  if (isLoading || !task) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-100 bg-white p-8 text-center text-slate-500">
        Loading task...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" className="px-0 text-slate-600 hover:text-slate-900">
        <Link href={Routes.TASKS}>
          <Icon icon="mdi:arrow-left" className="h-4 w-4" /> Back to tasks
        </Link>
      </Button>
      <TaskFormPage mode="edit" task={task} />
    </div>
  );
};

export default TaskDetailsPage;
