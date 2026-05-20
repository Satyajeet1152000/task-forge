import type { CreateSubTasksForTaskParams, DeleteSubTasksByTaskIdParams, SubTask } from "@task-forge/shared/types";

import { SubTaskEntity } from "./sub-task.entity";
import SubTaskRepository from "./sub-task.repository";
import { serializeSubTask } from "./sub-task.serializer";

export default class SubTaskWriter {
  public static async createForTask(params: CreateSubTasksForTaskParams): Promise<SubTask[]> {
    const { taskId, userId, subTasks } = params;

    if (subTasks.length === 0) {
      return [];
    }

    const entities = subTasks.map((subTaskInput) => {
      const title = subTaskInput.title.trim();
      const isCompleted = subTaskInput.isCompleted ?? false;

      const entity = new SubTaskEntity();
      entity.userId = userId;
      entity.taskId = taskId;
      entity.title = title;
      entity.isCompleted = isCompleted;

      return entity;
    });

    const savedEntities = await SubTaskRepository.save(entities);

    return savedEntities.map(serializeSubTask);
  }

  public static async replaceForTask(params: CreateSubTasksForTaskParams): Promise<SubTask[]> {
    const { taskId, userId } = params;

    await SubTaskRepository.delete({ taskId, userId });

    return SubTaskWriter.createForTask(params);
  }

  public static async deleteByTaskId(params: DeleteSubTasksByTaskIdParams): Promise<void> {
    const { taskId, userId } = params;

    await SubTaskRepository.delete({ taskId, userId });
  }
}
