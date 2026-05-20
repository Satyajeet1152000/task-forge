import type {
  CreateSubTasksForTaskParams,
  DeleteSubTasksByTaskIdParams,
  GetSubTasksByTaskIdParams,
  GetSubTasksByTaskIdsParams,
  SubTask,
} from "@task-forge/shared/types";

import SubTaskReader from "./internal/sub-task.reader";
import SubTaskWriter from "./internal/sub-task.writer";

export default class SubTaskService {
  public static async createForTask(params: CreateSubTasksForTaskParams): Promise<SubTask[]> {
    return SubTaskWriter.createForTask(params);
  }

  public static async getByTaskId(params: GetSubTasksByTaskIdParams): Promise<SubTask[]> {
    return SubTaskReader.getByTaskId(params);
  }

  public static async getByTaskIds(params: GetSubTasksByTaskIdsParams): Promise<SubTask[]> {
    return SubTaskReader.getByTaskIds(params);
  }

  public static async replaceForTask(params: CreateSubTasksForTaskParams): Promise<SubTask[]> {
    return SubTaskWriter.replaceForTask(params);
  }

  public static async deleteByTaskId(params: DeleteSubTasksByTaskIdParams): Promise<void> {
    return SubTaskWriter.deleteByTaskId(params);
  }
}
