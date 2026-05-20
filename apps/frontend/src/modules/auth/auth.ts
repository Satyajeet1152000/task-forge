import { googleAuthBodySchema, loginBodySchema } from "@task-forge/shared/schemas";
import type { User } from "@task-forge/shared/types";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import authConfig from "./auth.config";
import { throwCredentialsError } from "./auth.errors";
import { googleAuthWithBackend, loginWithBackend } from "./auth.server";

function mapUserToSession(user: User): {
  id: string;
  name: string;
  email: string;
  image: string | null;
} {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    image: user.image,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginBodySchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }
        try {
          const { user } = await loginWithBackend(parsed.data);
          return mapUserToSession(user);
        } catch (error) {
          throwCredentialsError(error);
        }
      },
    }),

    Credentials({
      id: "google",
      credentials: {
        credential: { type: "text" },
      },
      authorize: async (credentials) => {
        const parsed = googleAuthBodySchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }
        try {
          const { user } = await googleAuthWithBackend(parsed.data);
          return mapUserToSession(user);
        } catch (error) {
          throwCredentialsError(error);
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
