import { UserNotFoundError } from "@modules/auth/auth.error";
import UserService from "@modules/auth/user.service";
import { SubTaskService } from "@modules/sub-task";
import type {
  CreateTaskInput,
  SubTask,
  Task,
  TaskListData,
  TaskMemberSummary,
  TasksListData,
  TeamMemberTaskStats,
  UpdateTaskInput,
} from "@task-forge/shared/types";

import { deriveTaskStatusFromSubTasks } from "./internal/task-status.util";
import TaskReader from "./internal/task.reader";
import TaskWriter from "./internal/task.writer";
import { TaskNotFoundError } from "./task.error";

export default class TaskService {
  public static async getAll(userId: number): Promise<TasksListData> {
    const user = (await UserService.getUsersByIds([userId]))[0];
    if (!user) {
      throw new UserNotFoundError("User not found");
    }

    const tasks = await TaskReader.getTasksByIds(user.assignedTasks);

    const selfCreatedTasks = await TaskReader.getAllTasks(userId);

    const mergedTasks = TaskService.mergeTasksById([...tasks, ...selfCreatedTasks]);

    return TaskService.buildTasksListData(mergedTasks);
  }

  public static async getById(taskId: number, userId: number): Promise<TaskListData> {
    const task = await TaskReader.getTaskById(taskId, userId);

    return TaskService.buildTaskListData(task);
  }

  public static async create(userId: number, input: CreateTaskInput): Promise<Task> {
    return TaskWriter.createTask({ ...input, userId });
  }

  public static async update(
    taskId: number,
    userId: number,
    input: UpdateTaskInput,
  ): Promise<Task> {
    return TaskWriter.updateTask(taskId, userId, input);
  }

  public static async delete(taskId: number, userId: number): Promise<void> {
    await TaskWriter.deleteTask(taskId, userId);
  }

  public static async updateSubTaskCompletion(
    taskId: number,
    subTaskId: number,
    userId: number,
    isCompleted: boolean,
  ): Promise<TaskListData> {
    const taskEntity = await TaskReader.getTaskEntityById(taskId);
    const normalizedUserId = Number(userId);
    const assignedMemberIds = taskEntity.assignedMembers.map((memberId) => Number(memberId));

    if (!assignedMemberIds.includes(normalizedUserId)) {
      throw new TaskNotFoundError(`Task with id ${taskId} not found`);
    }

    await SubTaskService.updateCompletion({
      taskId,
      subTaskId,
      userId: taskEntity.userId,
      isCompleted,
    });

    const subTasks = await SubTaskService.getByTaskId({
      taskId: taskEntity.id,
      userId: taskEntity.userId,
    });

    taskEntity.status = deriveTaskStatusFromSubTasks(subTasks);
    await TaskWriter.saveTaskEntity(taskEntity);

    const task = await TaskReader.getTaskById(taskId, userId);

    return TaskService.buildTaskListData(task);
  }

  public static async getAssignmentStatsByMemberIds(
    ownerUserId: number,
    memberIds: number[],
  ): Promise<Record<number, TeamMemberTaskStats>> {
    return TaskReader.getAssignmentStatsByMemberIds(ownerUserId, memberIds);
  }

  public static async unassignMemberFromOwnerTasks(
    ownerUserId: number,
    memberId: number,
  ): Promise<void> {
    await TaskWriter.unassignMemberFromAllOwnerTasks(ownerUserId, memberId);
  }

  private static mergeTasksById(tasks: Task[]): Task[] {
    const tasksById = new Map<number, Task>();

    for (const task of tasks) {
      tasksById.set(task.id, task);
    }

    return [...tasksById.values()];
  }

  private static async buildTaskListData(task: Task): Promise<TaskListData> {
    const listData = await TaskService.buildTasksListData([task]);

    return {
      task: listData.tasks[0],
      assignedMembers: listData.assignedMembers,
      subTasks: listData.subTasks,
    };
  }

  private static async buildTasksListData(tasks: Task[]): Promise<TasksListData> {
    const assignedMembers: Record<string, TaskMemberSummary> = {};
    const subTasks: Record<string, SubTask> = {};
    const memberIds = new Set<number>();

    for (const task of tasks) {
      for (const memberId of task.assignedMembers) {
        memberIds.add(memberId);
      }
      for (const subTask of task.subTasks) {
        subTasks[String(subTask.id)] = subTask;
      }
    }

    const users = await UserService.getUsersByIds([...memberIds]);
    for (const user of users) {
      assignedMembers[String(user.id)] = user;
    }

    return { tasks, assignedMembers, subTasks };
  }
}
