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

export function useLoginForm() {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      email: "",
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

    toast.success("Logged in successfully");
    router.push(Routes.DASHBOARD);
    router.refresh();
  });
  return { form, onSubmit, isSubmitting: form.formState.isSubmitting };
}
