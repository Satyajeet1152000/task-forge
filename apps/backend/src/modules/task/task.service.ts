import UserService from "@modules/auth/user.service";
import type {
  CreateTaskInput,
  SubTask,
  Task,
  TaskMemberSummary,
  TasksListData,
  UpdateTaskInput,
} from "@task-forge/shared/types";

import TaskReader from "./internal/task.reader";
import TaskWriter from "./internal/task.writer";

export default class TaskService {
  public static async getAll(userId: number): Promise<TasksListData> {
    const tasks = await TaskReader.getAllTasks(userId);

    return TaskService.buildTasksListData(tasks);
  }

  public static async getById(taskId: number, userId: number): Promise<Task> {
    return TaskReader.getTaskById(taskId, userId);
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
    await TaskReader.getTaskById(taskId, userId);

    await TaskWriter.deleteTask(taskId, userId);
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
