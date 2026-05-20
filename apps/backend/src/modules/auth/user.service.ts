import type { TaskMemberSummary } from "@task-forge/shared/types";

import UserReader from "./internal/user.reader";
import UserWriter from "./internal/user.writer";

export default class UserService {
  public static async syncTaskAssignments(
    taskId: number,
    previousMemberIds: number[],
    nextMemberIds: number[],
  ): Promise<void> {
    await UserWriter.syncTaskAssignments(taskId, previousMemberIds, nextMemberIds);
  }

  public static async getUsersByIds(userIds: number[]): Promise<TaskMemberSummary[]> {
    return UserReader.getUsersByIds(userIds);
  }

  public static async userExists(userId: number): Promise<boolean> {
    return UserReader.userExists(userId);
  }
}
