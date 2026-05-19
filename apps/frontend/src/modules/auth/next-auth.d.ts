import type { UserRole } from "@task-forge/shared/types";
import type { DefaultSession } from "next-auth";

export type SessionUser = DefaultSession["user"] & {
  id: string;
  role: UserRole;
  image: string | null;
};

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }

  interface User {
    id: string;
    role: UserRole;
    image: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
