import type { TeamMemberUser } from "@task-forge/shared/types";

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

  public static async getUsersByIds(userIds: number[]): Promise<TeamMemberUser[]> {
    return UserReader.getUsersByIds(userIds);
  }

  public static async userExists(userId: number): Promise<boolean> {
    return UserReader.userExists(userId);
  }
}
