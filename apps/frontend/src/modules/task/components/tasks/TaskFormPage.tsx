"use client";

import type { CreateTaskInput, Task } from "@task-forge/shared/types";

import { useCreateTask, useDeleteTask, useUpdateTask } from "../../task.queries";

import TaskForm from "./TaskForm";

import { Button } from "@/components/ui/button";

interface TaskFormPageProps {
  mode: "create" | "edit";
  task?: Task;
}

const TaskFormPage: React.FC<TaskFormPageProps> = ({ mode, task }) => {
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask(task?.id ?? 0);
  const deleteMutation = useDeleteTask(task?.id ?? 0);

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSubmit = (payload: CreateTaskInput): void => {
    if (mode === "create") {
      createMutation.mutate(payload);
      return;
    }
    if (task) {
      updateMutation.mutate(payload);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <TaskForm
        mode={mode}
        initialTask={task}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      >
        {() => (
          <div className="space-y-3 pt-2">
            {mode === "create" ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full bg-sky-200 text-sm font-semibold uppercase tracking-wide text-sky-900 hover:bg-sky-300"
              >
                Create Task
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full bg-sky-200 text-sm font-semibold uppercase tracking-wide text-sky-900 hover:bg-sky-300"
                >
                  Update Task
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isSubmitting}
                  className="h-12 w-full text-sm font-semibold uppercase tracking-wide"
                  onClick={() => deleteMutation.mutate()}
                >
                  Delete Task
                </Button>
              </>
            )}
          </div>
        )}
      </TaskForm>
    </div>
  );
};

export default TaskFormPage;
