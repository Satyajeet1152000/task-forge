import UserService from "@modules/auth/user.service";
import { SubTaskService } from "@modules/sub-task";
import type { CreateTaskParams, SubTask, Task, UpdateTaskInput } from "@task-forge/shared/types";
import { TaskPriority, TaskStatus } from "@task-forge/shared/types";

import { TaskNotFoundError } from "../task.error";

import { deriveTaskStatusFromSubTasks } from "./task-status.util";
import { TaskEntity } from "./task.entity";
import TaskRepository from "./task.repository";
import { serializeTask } from "./task.serializer";

export default class TaskWriter {
  public static async createTask(params: CreateTaskParams): Promise<Task> {
    const title = params.title.trim();
    const description = params.description?.trim() ?? null;
    const priority = params.priority ?? TaskPriority.MEDIUM;
    const dueDate = params.dueDate ? new Date(params.dueDate) : null;
    const assignedMembers = params.assignedMembers ?? [];
    const attachments = params.attachments ?? [];
    const subTaskInputs = params.subTasks ?? [];

    const task = new TaskEntity();
    task.userId = params.userId;
    task.title = title;
    task.description = description;
    task.status = params.status ?? TaskStatus.PENDING;
    task.priority = priority;
    task.dueDate = dueDate;
    task.assignedMembers = assignedMembers;
    task.attachments = attachments;
    task.subTasks = [];

    const savedTask = await TaskRepository.save(task);

    const subTasks = await SubTaskService.createForTask({
      taskId: Number(savedTask.id),
      userId: params.userId,
      subTasks: subTaskInputs,
    });

    savedTask.subTasks = TaskWriter.toSubTaskIds(subTasks);
    savedTask.status = deriveTaskStatusFromSubTasks(subTasks);
    await TaskRepository.save(savedTask);

    await UserService.syncTaskAssignments(savedTask.id, [], savedTask.assignedMembers);

    return serializeTask(savedTask, subTasks);
  }

  public static async updateTask(
    taskId: number,
    userId: number,
    input: UpdateTaskInput,
  ): Promise<Task> {
    const task = await TaskRepository.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw new TaskNotFoundError(`Task with id ${taskId} not found`);
    }

    const previousMembers = [...task.assignedMembers];
    TaskWriter.applyTaskInput(task, input);

    let subTasks = await SubTaskService.getByTaskId({ taskId: task.id, userId: task.userId });
    if (input.subTasks !== undefined) {
      subTasks = await SubTaskService.replaceForTask({
        taskId: task.id,
        userId: task.userId,
        subTasks: input.subTasks,
      });
      task.subTasks = TaskWriter.toSubTaskIds(subTasks);
      task.status = deriveTaskStatusFromSubTasks(subTasks);
    }

    const savedTask = await TaskRepository.save(task);

    await UserService.syncTaskAssignments(savedTask.id, previousMembers, savedTask.assignedMembers);

    return serializeTask(savedTask, subTasks);
  }

  public static async unassignMemberFromAllOwnerTasks(
    ownerUserId: number,
    memberId: number,
  ): Promise<void> {
    const tasks = await TaskRepository.find({ where: { userId: ownerUserId } });
    const normalizedMemberId = Number(memberId);

    for (const task of tasks) {
      const previousMembers = task.assignedMembers.map((id) => Number(id));
      if (!previousMembers.includes(normalizedMemberId)) {
        continue;
      }

      task.assignedMembers = previousMembers.filter((id) => id !== normalizedMemberId);
      const savedTask = await TaskRepository.save(task);

      await UserService.syncTaskAssignments(
        Number(savedTask.id),
        previousMembers,
        savedTask.assignedMembers.map((id) => Number(id)),
      );
    }
  }

  public static async deleteTask(taskId: number, userId: number): Promise<void> {
    const task = await TaskRepository.findOne({ where: { id: taskId, userId } });
    if (!task) {
      return;
    }

    await UserService.syncTaskAssignments(task.id, task.assignedMembers, []);
    await SubTaskService.deleteByTaskId({ taskId, userId: task.userId });
    await TaskRepository.delete({ id: taskId });
  }

  public static async saveTaskEntity(task: TaskEntity): Promise<TaskEntity> {
    return TaskRepository.save(task);
  }

  private static applyTaskInput(task: TaskEntity, input: UpdateTaskInput): void {
    if (input.title !== undefined) {
      task.title = input.title.trim();
    }
    if (input.description !== undefined) {
      task.description = input.description?.trim() ?? null;
    }
    if (input.status !== undefined) {
      task.status = input.status;
    }
    if (input.priority !== undefined) {
      task.priority = input.priority;
    }
    if (input.dueDate !== undefined) {
      task.dueDate = input.dueDate ? new Date(input.dueDate) : null;
    }
    if (input.assignedMembers !== undefined) {
      task.assignedMembers = input.assignedMembers;
    }
    if (input.attachments !== undefined) {
      task.attachments = input.attachments;
    }
  }

  private static toSubTaskIds(subTasks: SubTask[]): number[] {
    return subTasks.map((subTask) => subTask.id);
  }
}
