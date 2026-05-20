"use client";

import { Icon } from "@iconify/react";
import { Routes } from "@task-forge/shared/constant";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutAction } from "@/modules/auth/auth.actions";
import { useAuth } from "@/modules/auth/use-auth";

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutAction();
    } finally {
      await signOut({ redirect: false });
    }
    toast.success("Logged out successfully");
    router.push(Routes.LOGIN);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Icon icon="mdi:loading" className="h-8 w-8 animate-spin text-muted-foreground" />
      </main>
    );
  }
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name ?? "User"}.</p>
        </div>
        <Button variant="outline" onClick={() => void handleLogout()}>
          Logout
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user?.role}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks</CardTitle>
            <CardDescription>Your workspace overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Task boards will appear here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity</CardTitle>
            <CardDescription>Recent updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default DashboardPage;
