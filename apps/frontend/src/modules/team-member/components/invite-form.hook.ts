"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createMemberInviteBodySchema } from "@task-forge/shared/schemas";
import type { CreateMemberInviteInput } from "@task-forge/shared/types";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const INVITE_EXPIRATION_OPTIONS = [
  { value: "2h", label: "2 Hr" },
  { value: "6h", label: "6 Hr" },
  { value: "12h", label: "12 Hr" },
  { value: "1d", label: "1 Day" },
  { value: "3d", label: "3 Day" },
  { value: "7d", label: "7 Day" },
] as const;

export type InviteExpirationDuration = (typeof INVITE_EXPIRATION_OPTIONS)[number]["value"];

const inviteExpirationDurationSchema = z.enum(["2h", "6h", "12h", "1d", "3d", "7d"]);

const inviteFormSchema = createMemberInviteBodySchema.omit({ expiresAt: true }).extend({
  email: z
    .union([z.literal(""), z.string().email("Please enter a valid email address")])
    .optional(),
  maxUses: z
    .union([z.literal(""), z.coerce.number().int().positive("Max uses must be a positive integer")])
    .optional(),
  expirationDuration: inviteExpirationDurationSchema,
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

export function calculateInviteExpiresAt(duration: InviteExpirationDuration): string {
  const expiresAt = new Date();

  switch (duration) {
    case "2h":
      expiresAt.setHours(expiresAt.getHours() + 2);
      break;
    case "6h":
      expiresAt.setHours(expiresAt.getHours() + 6);
      break;
    case "12h":
      expiresAt.setHours(expiresAt.getHours() + 12);
      break;
    case "1d":
      expiresAt.setDate(expiresAt.getDate() + 1);
      break;
    case "3d":
      expiresAt.setDate(expiresAt.getDate() + 3);
      break;
    case "7d":
      expiresAt.setDate(expiresAt.getDate() + 7);
      break;
  }

  return expiresAt.toISOString();
}

export function useInviteForm() {
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      expirationDuration: "7d",
      maxUses: "",
    },
  });

  const buildPayload = (values: InviteFormValues): CreateMemberInviteInput => {
    const email = values.email?.trim() ? values.email.trim().toLowerCase() : null;
    const maxUses =
      values.maxUses === "" || values.maxUses === undefined ? null : Number(values.maxUses);

    return {
      email,
      expiresAt: calculateInviteExpiresAt(values.expirationDuration),
      maxUses,
    };
  };

  return {
    form,
    buildPayload,
  };
}

export type { InviteFormValues };
