import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GoogleAuthInput, LoginInput, SignupInput } from "@task-forge/shared/types";
import { toast } from "sonner";

import * as authApi from "./auth.api";

export const AUTH_KEYS = {
  all: ["auth"] as const,
  me: ["auth", "me"] as const,
};

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authApi.fetchCurrentUser,
    enabled,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_KEYS.me, user);
      toast.success("Logged in successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Login failed");
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (input: SignupInput) => authApi.signup(input),
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    },
  });
}

export function useGoogleAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GoogleAuthInput) => authApi.googleAuth(input),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_KEYS.me, user);
      toast.success("Authenticated with Google");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Google authentication failed");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.me, null);
      queryClient.removeQueries({ queryKey: AUTH_KEYS.all });
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    },
  });
}
