import type { GetSubTasksByTaskIdParams, GetSubTasksByTaskIdsParams, SubTask } from "@task-forge/shared/types";
import { In } from "typeorm";

import SubTaskRepository from "./sub-task.repository";
import { serializeSubTask } from "./sub-task.serializer";

export default class SubTaskReader {
  public static async getByTaskId(params: GetSubTasksByTaskIdParams): Promise<SubTask[]> {
    const { taskId, userId } = params;

    const subTasks = await SubTaskRepository.find({
      where: { taskId, userId },
      order: { createdAt: "ASC" },
    });

    return subTasks.map(serializeSubTask);
  }

  public static async getByTaskIds(params: GetSubTasksByTaskIdsParams): Promise<SubTask[]> {
    const { taskIds } = params;

    if (taskIds.length === 0) {
      return [];
    }

    const subTasks = await SubTaskRepository.find({
      where: { taskId: In(taskIds) },
      order: { createdAt: "ASC" },
    });

    return subTasks.map(serializeSubTask);
  }
}
