"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signupBodySchema } from "@task-forge/shared/schemas";
import type { SignupInput } from "@task-forge/shared/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "../auth-provider";

export function useSignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupBodySchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      inviteToken: "",
      image: undefined,
    },
  });
  const handleImageChange = (file: File | null): void => {
    if (!file) {
      setImagePreview(null);
      form.setValue("image", null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      form.setValue("image", result);
    };
    reader.readAsDataURL(file);
  };
  const clearImage = (): void => {
    setImagePreview(null);
    form.setValue("image", null);
  };
  const onSubmit = form.handleSubmit(async (values) => {
    const payload: SignupInput = {
      name: values.name,
      email: values.email,
      password: values.password,
      ...(values.inviteToken ? { inviteToken: values.inviteToken } : {}),
      ...(values?.image ? { image: values?.image } : { image: null }),
    };
    await signup(payload);
    router.push("/login");
    router.refresh();
  });
  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    imagePreview,
    handleImageChange,
    clearImage,
  };
}
