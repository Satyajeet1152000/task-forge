"use client";

import { Icon } from "@iconify/react";
import { TaskPriority } from "@task-forge/shared/types";
import type { Task, TaskMemberSummary } from "@task-forge/shared/types";
import { useMemo, useState } from "react";

import MemberAvatars from "./MemberAvatars";
import SelectMemberModal from "./SelectMemberModal";
import { useTaskForm } from "./task-form.hook";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeamMembers } from "@/modules/team-member";

interface TaskFormProps {
  mode: "create" | "edit";
  initialTask?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ mode, initialTask }) => {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const { data: teamData } = useTeamMembers();

  const {
    form,
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
  } = useTaskForm({ mode, initialTask });

  const assignedMembersMap = useMemo((): Record<string, TaskMemberSummary> => {
    const map: Record<string, TaskMemberSummary> = {};
    for (const member of teamData?.members ?? []) {
      map[String(member.id)] = {
        id: member.id,
        name: member.name,
        email: member.email,
        image: member.image,
        assignedTasks: [],
      };
    }

    return map;
  }, [teamData?.members]);

  const minDueDate = useMemo((): string => {
    return new Date().toLocaleDateString("en-CA");
  }, []);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit();
        }}
        className="space-y-6 rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-slate-900">
          {mode === "create" ? "Create Task" : "Edit Task"}
        </h2>

        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input id="title" placeholder="Create App UI" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="Describe task"
            rows={4}
            className="flex w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...form.register("description")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              className="flex h-10 w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-sm"
              {...form.register("priority")}
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              min={minDueDate}
              className="relative bg-slate-50 pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              {...form.register("dueDate")}
            />
          </div>

          <div className="space-y-2">
            <Label>Assign To</Label>
            {assignedMemberIds.length > 0 ? (
              <div
                className="flex h-10 w-fit cursor-pointer items-center"
                onClick={() => setIsMemberModalOpen(true)}
              >
                <MemberAvatars
                  memberIds={assignedMemberIds}
                  assignedMembers={assignedMembersMap}
                  maxVisible={3}
                />
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2 bg-slate-50"
                onClick={() => setIsMemberModalOpen(true)}
              >
                <Icon icon="mdi:account-plus-outline" className="h-4 w-4" />
                Add Members
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label>TODO Checklist</Label>
          {subTaskItems.map((subTask, index) => (
            <div
              key={`${subTask.title}-${index}`}
              className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2"
            >
              <span className="w-6 text-sm font-medium text-slate-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-sm text-slate-800">{subTask.title}</span>
              <button
                type="button"
                onClick={() => removeSubTaskItem(index)}
                className="text-red-500 hover:text-red-600"
                aria-label="Remove subtask"
              >
                <Icon icon="mdi:trash-can-outline" className="h-5 w-5" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Enter Task"
              value={newSubTaskTitle}
              onChange={(event) => setNewSubTaskTitle(event.target.value)}
            />
            <Button type="button" variant="secondary" onClick={addSubTaskItem}>
              + Add
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Add Attachments</Label>
          {attachmentLinks.map((link, index) => (
            <div
              key={`${link}-${index}`}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="truncate text-slate-700">{link}</span>
              <button
                type="button"
                onClick={() => removeAttachmentLink(index)}
                className="text-red-500"
                aria-label="Remove attachment"
              >
                <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon
                icon="mdi:paperclip"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Add File Link"
                className="pl-9"
                value={newAttachmentLink}
                onChange={(event) => setNewAttachmentLink(event.target.value)}
              />
            </div>
            <Button type="button" variant="secondary" onClick={addAttachmentLink}>
              + Add
            </Button>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {mode === "create" ? (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full bg-sky-200 text-sm font-semibold uppercase tracking-wide text-sky-900 hover:bg-sky-300"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          ) : (
            <>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full bg-sky-200 text-sm font-semibold uppercase tracking-wide text-sky-900 hover:bg-sky-300"
              >
                {isSubmitting ? "Updating..." : "Update Task"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isSubmitting}
                className="h-12 w-full text-sm font-semibold uppercase tracking-wide"
                onClick={handleDelete}
              >
                Delete Task
              </Button>
            </>
          )}
        </div>
      </form>

      <SelectMemberModal
        open={isMemberModalOpen}
        onOpenChange={setIsMemberModalOpen}
        members={teamData?.members ?? []}
        selectedMemberIds={assignedMemberIds}
        onConfirm={setAssignedMemberIds}
      />
    </>
  );
};

export default TaskForm;
