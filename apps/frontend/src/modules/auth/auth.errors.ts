import type { ApiErrorResponse } from "@task-forge/shared/types";
import { CredentialsSignin } from "next-auth";

export function parseApiErrorMessage(body: ApiErrorResponse): string {
  if (body.subErrors?.length) {
    const subErrorMessages = body.subErrors
      .map((item) => item.message.trim())
      .filter(Boolean)
      .join(". ");
    if (subErrorMessages) {
      return subErrorMessages;
    }
  }
  return body.message;
}

export function throwCredentialsError(error: unknown): never {
  const message = error instanceof Error ? error.message : "Authentication failed";
  const signInError = new CredentialsSignin();
  signInError.code = message;
  throw signInError;
}

interface SignInResult {
  error?: string | null;
  code?: string | null;
  ok?: boolean;
}

export function getSignInErrorMessage(result: SignInResult): string {
  if (result.code) {
    return result.code;
  }
  if (result.error === "CredentialsSignin") {
    return "Invalid email or password";
  }
  return result.error ?? "Authentication failed";
}

export function parseSignInResult(
  result: SignInResult | undefined | void,
): { success: true } | { success: false; message: string } {
  if (!result) {
    return {
      success: false,
      message: "Authentication service unavailable. Please try again.",
    };
  }
  if (result.error || result.ok === false) {
    return { success: false, message: getSignInErrorMessage(result) };
  }
  return { success: true };
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
