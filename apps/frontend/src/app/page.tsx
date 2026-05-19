"use client";

import { Icon } from "@iconify/react";
import { Routes } from "@task-forge/shared/constant";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { useAuth } from "@/modules/auth/use-auth";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  useEffect(() => {
    if (isLoading) {
      return;
    }
    router.replace(isAuthenticated ? Routes.DASHBOARD : Routes.LOGIN);
  }, [isLoading, isAuthenticated, router]);
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Icon icon="mdi:loading" className="h-8 w-8 animate-spin text-muted-foreground" />
    </main>
  );
};

export default HomePage;
