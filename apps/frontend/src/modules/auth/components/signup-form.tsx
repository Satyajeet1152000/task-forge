"use client";

import { Icon } from "@iconify/react";
import { Routes } from "@task-forge/shared/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

import { parseSignInResult } from "../auth.errors";

import AuthLayout from "./auth-layout";
import AvatarPicker from "./avatar-picker";
import GoogleAuthButton from "./google-auth-button";
import PasswordInput from "./password-input";
import { useSignupForm } from "./signup-form.hook";

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
import { buildInvitePageRoute, buildLoginWithInviteRoute } from "@/modules/team-member";

interface SignupFormProps {
  inviteCode?: string;
  inviteEmail?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ inviteCode, inviteEmail }) => {
  const { form, onSubmit, isSubmitting, selectedAvatar, handleAvatarSelect } = useSignupForm({
    inviteCode,
    inviteEmail,
  });
  const router = useRouter();
  const watchedEmail = form.watch("email");

  const handleGoogleSuccess = async (credential: string): Promise<void> => {
    const result = await signIn("google", { credential, redirect: false });
    const signInOutcome = parseSignInResult(result);

    if (!signInOutcome.success) {
      toast.error(signInOutcome.message);
      return;
    }

    if (inviteCode) {
      router.push(buildInvitePageRoute(inviteCode, inviteEmail ?? watchedEmail));
      router.refresh();
      return;
    }

    toast.success("Authenticated with Google");
    router.push(Routes.DASHBOARD);
    router.refresh();
  };

  const loginHref = inviteCode
    ? buildLoginWithInviteRoute(inviteCode, watchedEmail || inviteEmail)
    : Routes.LOGIN;

  return (
    <AuthLayout
      title={"Create an Account"}
      subtitle={
        inviteCode
          ? "Complete signup to continue to the team invite page."
          : "Join us today by entering your details below."
      }
    >
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
            <AvatarPicker selectedAvatar={selectedAvatar} onSelect={handleAvatarSelect} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inviteToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite Code</FormLabel>
                    <FormControl>
                      <Input placeholder="6 Digit Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full text-base font-semibold uppercase"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icon icon="mdi:loading" className="h-5 w-5 animate-spin" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
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
          Already have an account?{" "}
          <Link href={loginHref} className="font-medium text-blue-600 underline underline-offset-4">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupForm;
