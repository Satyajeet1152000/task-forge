import { z } from "zod";

import { RouteTags } from "../types/swagger.types";

import { successResponseSchema } from "./common-schemas";
import { teamMembersListSchema } from "./team-member.schema";

export const memberInviteCodeParamsSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Invite code must be a 6-digit number"),
});

export const teamInviteInviterSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
});

export const memberInvitePreviewSchema = z.object({
  code: z.string(),
  email: z.string().email().nullable(),
  expiresAt: z.string(),
  maxUses: z.number().nullable(),
  usedCount: z.number(),
  isActive: z.boolean(),
  inviter: teamInviteInviterSchema,
});

export const createMemberInviteBodySchema = z.object({
  email: z.string().email("Please enter a valid email address").optional().nullable(),
  expiresAt: z.string().datetime({ message: "Expiration date is required" }),
  maxUses: z
    .number()
    .int()
    .positive("Max uses must be a positive integer")
    .optional()
    .nullable(),
});

export const createdMemberInviteSchema = z.object({
  code: z.string(),
  expiresAt: z.string(),
  maxUses: z.number().nullable(),
  email: z.string().email().nullable(),
});

export const validateMemberInviteBodySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const validateMemberInviteResultSchema = z.object({
  isValid: z.boolean(),
  userExists: z.boolean(),
  invite: memberInvitePreviewSchema,
});

export const postCreateMemberInviteRouteSchema = {
  tags: [RouteTags.MEMBER_INVITES],
  summary: "Create team invite",
  description: "Create an invite link for a new team member",
  body: createMemberInviteBodySchema,
  requestBodyExample: {
    email: "colleague@example.com",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    maxUses: 5,
  },
  response: {
    201: successResponseSchema(createdMemberInviteSchema),
  },
};

export const getMemberInviteByCodeRouteSchema = {
  tags: [RouteTags.MEMBER_INVITES],
  summary: "Get invite details",
  description: "Return invite preview data for the join page",
  params: memberInviteCodeParamsSchema,
  response: {
    200: successResponseSchema(memberInvitePreviewSchema),
  },
};

export const postValidateMemberInviteRouteSchema = {
  tags: [RouteTags.MEMBER_INVITES],
  summary: "Validate invite",
  description: "Validate an invite code and check whether the email belongs to an existing user",
  params: memberInviteCodeParamsSchema,
  body: validateMemberInviteBodySchema,
  requestBodyExample: {
    email: "colleague@example.com",
  },
  response: {
    200: successResponseSchema(validateMemberInviteResultSchema),
  },
};

export const postAcceptMemberInviteRouteSchema = {
  tags: [RouteTags.MEMBER_INVITES],
  summary: "Accept invite",
  description: "Join the inviter team using a valid invite code",
  params: memberInviteCodeParamsSchema,
  body: validateMemberInviteBodySchema.partial(),
  response: {
    200: successResponseSchema(teamMembersListSchema),
  },
};
