import { SubTaskService } from "@modules/sub-task";
import type { SubTask, Task, TeamMemberTaskStats } from "@task-forge/shared/types";
import { TaskStatus } from "@task-forge/shared/types";
import { In } from "typeorm";

import { TaskNotFoundError } from "../task.error";

import { TaskEntity } from "./task.entity";
import TaskRepository from "./task.repository";
import { serializeTask } from "./task.serializer";

export default class TaskReader {
  public static async getAllTasks(userId: number): Promise<Task[]> {
    const tasks = await TaskRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });

    return TaskReader.serializeTasksWithSubTasks(tasks);
  }

  public static async getAssignmentStatsByMemberIds(
    ownerUserId: number,
    memberIds: number[],
  ): Promise<Record<number, TeamMemberTaskStats>> {
    const statsByMemberId = TaskReader.createEmptyStatsMap(memberIds);
    if (memberIds.length === 0) {
      return statsByMemberId;
    }

    const memberIdSet = new Set(memberIds.map((memberId) => Number(memberId)));
    const tasks = await TaskRepository.find({ where: { userId: ownerUserId } });

    for (const task of tasks) {
      for (const assignedMemberId of task.assignedMembers) {
        const memberId = Number(assignedMemberId);
        if (!memberIdSet.has(memberId)) {
          continue;
        }

        const stats = statsByMemberId[memberId];
        if (task.status === TaskStatus.PENDING) {
          stats.pending += 1;
        } else if (task.status === TaskStatus.IN_PROGRESS) {
          stats.inProgress += 1;
        } else if (task.status === TaskStatus.COMPLETED) {
          stats.completed += 1;
        }
      }
    }

    return statsByMemberId;
  }

  public static async getTaskById(taskId: number, userId: number): Promise<Task> {
    const task = await TaskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new TaskNotFoundError(`Task with id ${taskId} not found`);
    }

    const normalizedUserId = Number(userId);
    const isOwner = Number(task.userId) === normalizedUserId;
    const isAssigned = task.assignedMembers.map((memberId) => Number(memberId)).includes(normalizedUserId);

    if (!isOwner && !isAssigned) {
      throw new TaskNotFoundError(`Task with id ${taskId} not found`);
    }

    const subTasks = await SubTaskService.getByTaskId({ taskId: task.id, userId: task.userId });

    return serializeTask(task, subTasks);
  }

  public static async getTaskEntityById(taskId: number): Promise<TaskEntity> {
    const task = await TaskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new TaskNotFoundError(`Task with id ${taskId} not found`);
    }

    return task;
  }

  public static async getTasksByIds(taskIds: number[]): Promise<Task[]> {
    if (taskIds.length === 0) {
      return [];
    }

    const tasks = await TaskRepository.find({ where: { id: In(taskIds) } });

    return TaskReader.serializeTasksWithSubTasks(tasks);
  }

  private static async serializeTasksWithSubTasks(
    tasks: Awaited<ReturnType<typeof TaskRepository.find>>,
  ): Promise<Task[]> {
    if (tasks.length === 0) {
      return [];
    }

    const taskIds = tasks.map((task) => Number(task.id));
    const allSubTasks = await SubTaskService.getByTaskIds({ taskIds });
    const subTasksByTaskId = TaskReader.groupSubTasksByTaskId(allSubTasks);

    return tasks.map((task) => serializeTask(task, subTasksByTaskId.get(Number(task.id)) ?? []));
  }

  private static createEmptyStatsMap(memberIds: number[]): Record<number, TeamMemberTaskStats> {
    const statsByMemberId: Record<number, TeamMemberTaskStats> = {};

    for (const memberId of memberIds) {
      statsByMemberId[Number(memberId)] = { pending: 0, inProgress: 0, completed: 0 };
    }

    return statsByMemberId;
  }

  private static groupSubTasksByTaskId(subTasks: SubTask[]): Map<number, SubTask[]> {
    const subTasksByTaskId = new Map<number, SubTask[]>();

    for (const subTask of subTasks) {
      const existing = subTasksByTaskId.get(subTask.taskId) ?? [];
      existing.push(subTask);
      subTasksByTaskId.set(subTask.taskId, existing);
    }

    return subTasksByTaskId;
  }
}
