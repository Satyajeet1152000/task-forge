import type { User } from "@task-forge/shared/types";

import { UserEntity } from "./user.entity";

export const serializeUser = (user: UserEntity): User => {
  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    provider: user.provider,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};
