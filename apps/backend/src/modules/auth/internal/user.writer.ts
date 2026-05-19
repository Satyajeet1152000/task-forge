import { hashPassword } from "@lib/password.util";
import { AuthProvider, UserRole, type SignupInput, type User } from "@task-forge/shared/types";

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
    user.role = input?.inviteToken ? UserRole.USER : UserRole.ADMIN;

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
    user.role = UserRole.USER;

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
}
