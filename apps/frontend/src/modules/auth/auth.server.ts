import { AUTH_COOKIE_NAME } from "@task-forge/shared/constant";
import type {
  ApiErrorResponse,
  ApiResponse,
  GoogleAuthInput,
  LoginInput,
  SignupInput,
  User,
} from "@task-forge/shared/types";
import { cookies } from "next/headers";

import { parseApiErrorMessage } from "./auth.errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function getApiUrl(path: string): string {
  return `${API_BASE_URL}/api${path}`;
}

async function parseAuthResponse(response: Response): Promise<User> {
  const body = (await response.json()) as ApiResponse<User> | ApiErrorResponse;
  if (!response.ok || !body.success || !("data" in body) || !body.data) {
    if ("statusCode" in body && body.message) {
      throw new Error(parseApiErrorMessage(body));
    }
    throw new Error("Authentication failed");
  }
  return body.data;
}

export async function syncBackendAuthCookie(response: Response): Promise<void> {
  const setCookieHeaders =
    typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
  if (setCookieHeaders.length === 0) {
    return;
  }
  const cookieStore = await cookies();
  for (const header of setCookieHeaders) {
    if (!header.startsWith(`${AUTH_COOKIE_NAME}=`)) {
      continue;
    }
    const [nameValue] = header.split(";");
    const [, value] = nameValue.split("=");
    if (!value) {
      continue;
    }
    cookieStore.set(AUTH_COOKIE_NAME, value, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export async function clearBackendAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function loginWithBackend(input: LoginInput): Promise<{ user: User }> {
  const response = await fetch(getApiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const user = await parseAuthResponse(response);
  await syncBackendAuthCookie(response);
  return { user };
}

export async function signupWithBackend(input: SignupInput): Promise<{ user: User }> {
  const response = await fetch(getApiUrl("/auth/signup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const user = await parseAuthResponse(response);
  await syncBackendAuthCookie(response);
  return { user };
}

export async function googleAuthWithBackend(input: GoogleAuthInput): Promise<{ user: User }> {
  const response = await fetch(getApiUrl("/auth/google"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const user = await parseAuthResponse(response);
  await syncBackendAuthCookie(response);
  return { user };
}

export async function logoutWithBackend(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  try {
    await fetch(getApiUrl("/auth/logout"), {
      method: "POST",
      headers: token ? { Cookie: `${AUTH_COOKIE_NAME}=${token}` } : undefined,
      cache: "no-store",
    });
  } catch {}

  await clearBackendAuthCookie();
}
