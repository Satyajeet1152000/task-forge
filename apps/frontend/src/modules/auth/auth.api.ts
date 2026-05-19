import type {
  ApiResponse,
  GoogleAuthInput,
  LoginInput,
  SignupInput,
  User,
} from "@task-forge/shared/types";

import { apiClient } from "@/lib/axios";

export async function signup(input: SignupInput): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User>>("/auth/signup", input);
  if (!data.data) {
    throw new Error("Signup failed");
  }
  return data.data;
}

export async function login(input: LoginInput): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User>>("/auth/login", input);
  if (!data.data) {
    throw new Error("Login failed");
  }
  return data.data;
}

export async function googleAuth(input: GoogleAuthInput): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User>>("/auth/google", input);
  if (!data.data) {
    throw new Error("Google authentication failed");
  }
  return data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
  if (!data.data) {
    throw new Error("Not authenticated");
  }
  return data.data;
}
