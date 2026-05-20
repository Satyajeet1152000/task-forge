"use client";

import type { Task } from "@task-forge/shared/types";

import TaskForm from "./TaskForm";

interface TaskFormPageProps {
  mode: "create" | "edit";
  task?: Task;
}

const TaskFormPage: React.FC<TaskFormPageProps> = ({ mode, task }) => {
  return (
    <div className="mx-auto max-w-3xl">
      <TaskForm mode={mode} initialTask={task} />
    </div>
  );
};

export default TaskFormPage;
