"use client";

import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children, className }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className={cn("w-full max-w-2xl border-0 shadow-none", className)}>
        <CardHeader className="space-y-2 px-0">
          <CardTitle className="text-3xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-base text-muted-foreground">{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="px-0">{children}</CardContent>
      </Card>
    </main>
  );
};

export default AuthLayout;
