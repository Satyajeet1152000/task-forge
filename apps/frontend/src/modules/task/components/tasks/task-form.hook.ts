"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskBodySchema } from "@task-forge/shared/schemas";
import type { CreateTaskInput, SubTask, SubTaskInput, Task } from "@task-forge/shared/types";
import { TaskPriority, TaskStatus } from "@task-forge/shared/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface TaskFormValues {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedMembers?: number[];
  attachments?: string[];
  subTasks?: SubTaskInput[];
}

interface UseTaskFormParams {
  mode: "create" | "edit";
  initialTask?: Task;
}

function toDateInputValue(isoDate: string | null | undefined): string {
  if (!isoDate) {
    return "";
  }
  return isoDate.slice(0, 10);
}

function mapSubTasksToInput(subTasks: SubTask[]): SubTaskInput[] {
  return subTasks.map((subTask) => ({
    title: subTask.title,
    isCompleted: subTask.isCompleted,
  }));
}

export function useTaskForm({ mode, initialTask }: UseTaskFormParams) {
  const [assignedMemberIds, setAssignedMemberIds] = useState<number[]>(
    initialTask?.assignedMembers ?? [],
  );
  const [subTaskItems, setSubTaskItems] = useState<SubTaskInput[]>(
    initialTask ? mapSubTasksToInput(initialTask.subTasks) : [],
  );
  const [attachmentLinks, setAttachmentLinks] = useState<string[]>(
    initialTask?.attachments ?? [],
  );
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [newAttachmentLink, setNewAttachmentLink] = useState("");

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(createTaskBodySchema),
    defaultValues: {
      title: initialTask?.title ?? "",
      description: initialTask?.description ?? "",
      priority: initialTask?.priority ?? TaskPriority.MEDIUM,
      dueDate: toDateInputValue(initialTask?.dueDate),
    },
  });

  useEffect(() => {
    if (!initialTask) {
      return;
    }
    form.reset({
      title: initialTask.title,
      description: initialTask.description ?? "",
      priority: initialTask.priority,
      dueDate: toDateInputValue(initialTask.dueDate),
    });
    setAssignedMemberIds(initialTask.assignedMembers);
    setSubTaskItems(mapSubTasksToInput(initialTask.subTasks));
    setAttachmentLinks(initialTask.attachments);
  }, [initialTask, form]);

  const buildPayload = (values: TaskFormValues): CreateTaskInput => {
    const dueDate = values.dueDate
      ? new Date(`${values.dueDate}T00:00:00.000Z`).toISOString()
      : undefined;

    return {
      title: values.title,
      description: values.description,
      priority: values.priority,
      dueDate,
      assignedMembers: assignedMemberIds,
      attachments: attachmentLinks,
      subTasks: subTaskItems,
    };
  };

  const addSubTaskItem = (): void => {
    const title = newSubTaskTitle.trim();
    if (!title) {
      return;
    }
    setSubTaskItems((current) => [...current, { title, isCompleted: false }]);
    setNewSubTaskTitle("");
  };

  const removeSubTaskItem = (index: number): void => {
    setSubTaskItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const addAttachmentLink = (): void => {
    const link = newAttachmentLink.trim();
    if (!link) {
      return;
    }
    setAttachmentLinks((current) => [...current, link]);
    setNewAttachmentLink("");
  };

  const removeAttachmentLink = (index: number): void => {
    setAttachmentLinks((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return {
    form,
    mode,
    assignedMemberIds,
    setAssignedMemberIds,
    subTaskItems,
    newSubTaskTitle,
    setNewSubTaskTitle,
    addSubTaskItem,
    removeSubTaskItem,
    newAttachmentLink,
    setNewAttachmentLink,
    addAttachmentLink,
    removeAttachmentLink,
    attachmentLinks,
    buildPayload,
  };
}
