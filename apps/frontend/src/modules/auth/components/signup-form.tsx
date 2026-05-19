"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useRef } from "react";

import { useAuth } from "../auth-provider";
import { redirectToDashboard } from "../auth.utils";

import AuthLayout from "./auth-layout";
import GoogleAuthButton from "./google-auth-button";
import PasswordInput from "./password-input";
import { useSignupForm } from "./signup-form.hook";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const SignupForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { form, onSubmit, isSubmitting, imagePreview, handleImageChange, clearImage } =
    useSignupForm();
  const { googleAuth, isLoading } = useAuth();
  const handleGoogleSuccess = async (credential: string): Promise<void> => {
    await googleAuth(credential);
    redirectToDashboard();
  };
  return (
    <AuthLayout title="Create an Account" subtitle="Join us today by entering your details below.">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview ?? undefined} alt="Profile preview" />
                <AvatarFallback>
                  <Icon icon="mdi:account" className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              {imagePreview ? (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                  onClick={clearImage}
                  aria-label="Remove profile image"
                >
                  <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload photo
            </Button>
          </div>
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
                  <FormLabel>Admin Invite Token</FormLabel>
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
            disabled={isSubmitting || isLoading}
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
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>
          <GoogleAuthButton
            label="Continue with Google"
            onSuccess={(credential) => void handleGoogleSuccess(credential)}
            disabled={isSubmitting || isLoading}
          />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 underline underline-offset-4">
              Login
            </Link>
          </p>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default SignupForm;
