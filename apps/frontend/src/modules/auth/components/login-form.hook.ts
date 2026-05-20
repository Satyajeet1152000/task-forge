"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Routes } from "@task-forge/shared/constant";
import { loginBodySchema } from "@task-forge/shared/schemas";
import type { LoginInput } from "@task-forge/shared/types";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getSignInErrorMessage } from "../auth.errors";

import { buildInvitePageRoute } from "@/modules/team-member";

interface UseLoginFormParams {
  inviteCode?: string;
  inviteEmail?: string;
}

export function useLoginForm(params: UseLoginFormParams = {}) {
  const router = useRouter();
  const inviteCode = params.inviteCode?.trim();
  const inviteEmail = params.inviteEmail?.trim().toLowerCase();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      email: inviteEmail ?? "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (result?.error) {
      toast.error(getSignInErrorMessage(result));
      return;
    }

    const email = values.email.trim().toLowerCase();

    if (inviteCode) {
      router.push(buildInvitePageRoute(inviteCode, email));
      router.refresh();
      return;
    }

    toast.success("Logged in successfully");
    router.push(Routes.DASHBOARD);
    router.refresh();
  });

  return { form, onSubmit, isSubmitting: form.formState.isSubmitting, inviteCode };
}
