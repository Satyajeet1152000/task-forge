"use client";

import type { LoginInput, SignupInput, User } from "@task-forge/shared/types";
import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";

import { useCurrentUser, useGoogleAuth, useLogin, useLogout, useSignup } from "./auth.queries";
import { useAuthStore } from "./auth.store";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  googleAuth: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const storedUser = useAuthStore((state) => state.user);
  const { data, isLoading, refetch, isError } = useCurrentUser();
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const googleAuthMutation = useGoogleAuth();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (data) {
      setUser(data);
    } else if (isError) {
      clearUser();
    }
  }, [data, isError, setUser, clearUser]);

  const user = data ?? null;
  const isAuthenticated = Boolean(data ?? storedUser);

  const login = useCallback(
    async (input: LoginInput) => {
      const loggedInUser = await loginMutation.mutateAsync(input);
      setUser(loggedInUser);
    },
    [loginMutation, setUser],
  );

  const signup = useCallback(
    async (input: SignupInput) => {
      await signupMutation.mutateAsync(input);
    },
    [signupMutation],
  );

  const googleAuth = useCallback(
    async (credential: string) => {
      const authenticatedUser = await googleAuthMutation.mutateAsync({ credential });
      setUser(authenticatedUser);
    },
    [googleAuthMutation, setUser],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    clearUser();
  }, [logoutMutation, clearUser]);

  const refreshUser = useCallback(async () => {
    const result = await refetch();
    if (result.data) {
      setUser(result.data);
    }
  }, [refetch, setUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading: isLoading || loginMutation.isPending || googleAuthMutation.isPending,
      isAuthenticated: isAuthenticated,
      login,
      signup,
      googleAuth,
      logout,
      refreshUser,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      loginMutation.isPending,
      googleAuthMutation.isPending,
      storedUser,
      login,
      signup,
      googleAuth,
      logout,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
