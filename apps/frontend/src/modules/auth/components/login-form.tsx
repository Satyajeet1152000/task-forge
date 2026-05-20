"use client";

import { Icon } from "@iconify/react";
import { Routes } from "@task-forge/shared/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

import { getSignInErrorMessage } from "../auth.errors";

import AuthLayout from "./auth-layout";
import GoogleAuthButton from "./google-auth-button";
import { useLoginForm } from "./login-form.hook";
import PasswordInput from "./password-input";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const LoginForm: React.FC = () => {
  const { form, onSubmit, isSubmitting } = useLoginForm();
  const router = useRouter();

  const handleGoogleSuccess = async (credential: string): Promise<void> => {
    const result = await signIn("google", { credential, redirect: false });
    if (result?.error) {
      toast.error(getSignInErrorMessage(result));
      return;
    }
    toast.success("Authenticated with Google");
    router.push(Routes.DASHBOARD);
    router.refresh();
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Please enter your details to log in">
      <div className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void onSubmit();
            }}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Min 8 Characters"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-12 w-full text-base font-semibold uppercase"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icon icon="mdi:loading" className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>
        <GoogleAuthButton
          label="Continue with Google"
          onSuccess={(credential) => void handleGoogleSuccess(credential)}
          disabled={isSubmitting}
        />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-blue-600 underline underline-offset-4">
            SignUp
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
