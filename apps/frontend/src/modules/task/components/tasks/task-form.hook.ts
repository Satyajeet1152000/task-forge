"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskBodySchema } from "@task-forge/shared/schemas";
import type { CreateTaskInput, SubTask, SubTaskInput, Task } from "@task-forge/shared/types";
import { TaskPriority } from "@task-forge/shared/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useCreateTask, useDeleteTask, useUpdateTask } from "../../task.queries";

const taskFormSchema = createTaskBodySchema
  .pick({
    title: true,
    description: true,
    priority: true,
  })
  .extend({
    dueDate: z.string().optional(),
  });

export type TaskFormValues = z.infer<typeof taskFormSchema>;

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
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask(initialTask?.id ?? 0);
  const deleteMutation = useDeleteTask(initialTask?.id ?? 0);

  const [assignedMemberIds, setAssignedMemberIds] = useState<number[]>(
    initialTask?.assignedMembers ?? [],
  );
  const [subTaskItems, setSubTaskItems] = useState<SubTaskInput[]>(
    initialTask ? mapSubTasksToInput(initialTask.subTasks) : [],
  );
  const [attachmentLinks, setAttachmentLinks] = useState<string[]>(initialTask?.attachments ?? []);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [newAttachmentLink, setNewAttachmentLink] = useState("");

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
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
    const trimmedDueDate = values.dueDate?.trim();
    const dueDate = trimmedDueDate
      ? new Date(`${trimmedDueDate}T00:00:00.000Z`).toISOString()
      : undefined;

    return {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      priority: values.priority,
      dueDate,
      assignedMembers: assignedMemberIds,
      attachments: attachmentLinks,
      subTasks: subTaskItems,
    };
  };

  const onSubmit = form.handleSubmit(
    (values) => {
      const payload = buildPayload(values);

      if (mode === "create") {
        createMutation.mutate(payload);
        return;
      }

      if (initialTask) {
        updateMutation.mutate(payload);
      }
    },
    (errors) => {
      const firstError = Object.values(errors)[0]?.message;
      toast.error(firstError ? String(firstError) : "Please fix the form errors");
    },
  );

  const handleDelete = (): void => {
    deleteMutation.mutate();
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

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
    onSubmit,
    handleDelete,
    isSubmitting,
  };
}
