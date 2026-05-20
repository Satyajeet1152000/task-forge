import { SubTaskService } from "@modules/sub-task";
import type { SubTask, Task } from "@task-forge/shared/types";

import { TaskNotFoundError } from "../task.error";

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

  public static async getTaskById(taskId: number, userId: number): Promise<Task> {
    const task = await TaskRepository.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw new TaskNotFoundError(`Task with id ${taskId} not found`);
    }

    const subTasks = await SubTaskService.getByTaskId({ taskId: task.id, userId: task.userId });

    return serializeTask(task, subTasks);
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
