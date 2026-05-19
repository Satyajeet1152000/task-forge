"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Routes } from "@task-forge/shared/constant";
import { signupBodySchema } from "@task-forge/shared/schemas";
import type { SignupInput } from "@task-forge/shared/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signupAction } from "../auth.actions";
import { getErrorMessage } from "../auth.errors";
import { getRandomSignupAvatar } from "../signup-avatars.constants";

export function useSignupForm() {
  const router = useRouter();
  const initialAvatar = useMemo(() => getRandomSignupAvatar(), []);
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupBodySchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      inviteToken: "",
      image: initialAvatar,
    },
  });

  const handleAvatarSelect = (avatarPath: string): void => {
    setSelectedAvatar(avatarPath);
    form.setValue("image", avatarPath, { shouldValidate: true });
  };

  const onSubmit = form.handleSubmit(
    async (values) => {
      const payload: SignupInput = {
        name: values.name,
        email: values.email,
        password: values.password,
        ...(values.inviteToken ? { inviteToken: values.inviteToken } : {}),
        image: values.image ?? selectedAvatar,
      };
      try {
        await signupAction(payload);
        toast.success("Account created successfully");
        router.push(Routes.LOGIN);
        router.refresh();
      } catch (error) {
        toast.error(getErrorMessage(error, "Signup failed"));
      }
    },
    (errors) => {
      const firstError = Object.values(errors)[0]?.message;
      toast.error(firstError ? String(firstError) : "Please fix the form errors");
    },
  );

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    selectedAvatar,
    handleAvatarSelect,
  };
}
