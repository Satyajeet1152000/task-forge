"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginBodySchema } from "@task-forge/shared/schemas";
import type { LoginInput } from "@task-forge/shared/types";
import { useForm } from "react-hook-form";

import { useAuth } from "../auth-provider";
import { redirectToDashboard } from "../auth.utils";

export function useLoginForm() {
  const { login } = useAuth();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = form.handleSubmit(async (values) => {
    await login(values);
    redirectToDashboard();
  });
  return { form, onSubmit, isSubmitting: form.formState.isSubmitting };
}
