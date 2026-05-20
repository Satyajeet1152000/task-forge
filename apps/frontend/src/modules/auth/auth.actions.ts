"use server";

import type { SignupInput } from "@task-forge/shared/types";

import { signOut } from "./auth";
import { logoutWithBackend, signupWithBackend } from "./auth.server";

export async function signupAction(input: SignupInput): Promise<void> {
  await signupWithBackend(input);
}

export async function logoutAction(): Promise<void> {
  await logoutWithBackend();
  await signOut({ redirect: false });
}
