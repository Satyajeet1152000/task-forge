import type { User } from "@task-forge/shared/types";

import { UserEmailAlreadyExistsError, UserNotFoundError } from "../auth.error";

import UserRepository from "./user.repository";
import { serializeUser } from "./user.serializer";

export default class UserReader {
  public static async getUserByEmail(email: string): Promise<User | null> {
    const user = await UserRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) {
      return null;
    }
    return serializeUser(user);
  }

  public static async getUserById(userId: number): Promise<User> {
    const user = await UserRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UserNotFoundError(`User with id ${userId} not found`);
    }
    return serializeUser(user);
  }

  public static async emailExists(email: string): Promise<boolean> {
    const count = await UserRepository.count({
      where: { email: email.trim().toLowerCase() },
    });
    return count > 0;
  }

  public static async requireUserByEmail(email: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    return user;
  }

  public static async assertEmailAvailable(email: string): Promise<void> {
    if (await this.emailExists(email)) {
      throw new UserEmailAlreadyExistsError("An account with this email already exists");
    }
  }
}
