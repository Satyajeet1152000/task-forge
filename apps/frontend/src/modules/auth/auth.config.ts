import { Routes } from "@task-forge/shared/constant";
import type { UserRole } from "@task-forge/shared/types";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [],
  pages: {
    signIn: Routes.LOGIN,
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.picture ?? null;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
