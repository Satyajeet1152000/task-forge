import { hashPassword } from "@lib/password.util";
import { AuthProvider, type SignupInput, type User } from "@task-forge/shared/types";
import { In } from "typeorm";

import { UserEntity } from "./user.entity";
import UserRepository from "./user.repository";
import { serializeUser } from "./user.serializer";

interface CreateGoogleUserParams {
  name: string;
  email: string;
  image: string | null;
}

export default class UserWriter {
  public static async createCredentialUser(input: SignupInput): Promise<User> {
    const user = new UserEntity();

    user.name = input.name.trim();
    user.email = input.email.trim().toLowerCase();
    user.password = await hashPassword(input.password);
    user.image = input.image ?? null;
    user.provider = AuthProvider.CREDENTIALS;
    user.assignedTasks = [];

    const saved = await UserRepository.save(user);

    return serializeUser(saved);
  }

  public static async createGoogleUser(params: CreateGoogleUserParams): Promise<User> {
    const user = new UserEntity();

    user.name = params.name.trim();
    user.email = params.email.trim().toLowerCase();
    user.password = null;
    user.image = params.image;
    user.provider = AuthProvider.GOOGLE;
    user.assignedTasks = [];

    const saved = await UserRepository.save(user);

    return serializeUser(saved);
  }

  public static async updateGoogleProfile(
    userId: number,
    params: { name: string; image: string | null },
  ): Promise<User> {
    const user = await UserRepository.findOneOrFail({ where: { id: userId } });

    user.name = params.name.trim();
    if (params.image) {
      user.image = params.image;
    }

    const saved = await UserRepository.save(user);

    return serializeUser(saved);
  }

  public static async syncTaskAssignments(
    taskId: number,
    previousMemberIds: number[],
    nextMemberIds: number[],
  ): Promise<void> {
    const previousSet = new Set(previousMemberIds.map((id) => Number(id)));
    const nextSet = new Set(nextMemberIds.map((id) => Number(id)));
    const addedMemberIds = [...nextSet].filter((memberId) => !previousSet.has(memberId));
    const removedMemberIds = [...previousSet].filter((memberId) => !nextSet.has(memberId));
    if (addedMemberIds.length > 0) {
      await this.addTaskToUsers(taskId, addedMemberIds);
    }
    if (removedMemberIds.length > 0) {
      await this.removeTaskFromUsers(taskId, removedMemberIds);
    }
  }

  private static async addTaskToUsers(taskId: number, userIds: number[]): Promise<void> {
    const users = await UserRepository.findBy({ id: In(userIds) });
    for (const user of users) {
      const assignedTasks = user.assignedTasks ?? [];
      if (!assignedTasks.includes(taskId)) {
        user.assignedTasks = [...assignedTasks, taskId];
      }
    }
    if (users.length > 0) {
      await UserRepository.save(users);
    }
  }

  private static async removeTaskFromUsers(taskId: number, userIds: number[]): Promise<void> {
    const users = await UserRepository.findBy({ id: In(userIds) });
    for (const user of users) {
      user.assignedTasks = (user.assignedTasks ?? []).filter((id) => Number(id) !== taskId);
    }
    if (users.length > 0) {
      await UserRepository.save(users);
    }
  }
}
