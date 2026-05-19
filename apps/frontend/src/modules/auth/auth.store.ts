import { UserRole, type User } from "@task-forge/shared/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PersistedUser {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
}

interface AuthStoreState {
  user: PersistedUser | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) =>
        set({
          user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role as UserRole,
              }
            : null,
        }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "task-forge-auth",
    },
  ),
);
