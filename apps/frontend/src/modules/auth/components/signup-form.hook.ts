"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Routes } from "@task-forge/shared/constant";
import { signupBodySchema } from "@task-forge/shared/schemas";
import type { SignupInput } from "@task-forge/shared/types";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signupAction } from "../auth.actions";
import { getErrorMessage, parseSignInResult } from "../auth.errors";
import { getRandomSignupAvatar } from "../signup-avatars.constants";

import { buildInvitePageRoute, buildLoginWithInviteRoute } from "@/modules/team-member";

interface UseSignupFormParams {
  inviteCode?: string;
  inviteEmail?: string;
}

export function useSignupForm(params: UseSignupFormParams = {}) {
  const router = useRouter();
  const inviteCode = params.inviteCode?.trim();
  const inviteEmail = params.inviteEmail?.trim().toLowerCase();
  const initialAvatar = useMemo(() => getRandomSignupAvatar(), []);
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupBodySchema),
    defaultValues: {
      name: "",
      email: inviteEmail ?? "",
      password: "",
      inviteToken: inviteCode ?? "",
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

      const email = values.email.trim().toLowerCase();

      try {
        await signupAction(payload);

        const loginResult = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        const signInOutcome = parseSignInResult(loginResult);

        if (!signInOutcome.success) {
          toast.error(signInOutcome.message);
          router.push(inviteCode ? buildLoginWithInviteRoute(inviteCode, email) : Routes.LOGIN);
          router.refresh();
          return;
        }

        if (inviteCode) {
          router.push(buildInvitePageRoute(inviteCode, email));
          router.refresh();
          return;
        }

        toast.success("Account created successfully");
        router.push(Routes.DASHBOARD);
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
