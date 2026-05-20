import type { z } from "zod";

import type {
  createMemberInviteBodySchema,
  createdMemberInviteSchema,
  memberInviteCodeParamsSchema,
  memberInvitePreviewSchema,
  teamInviteInviterSchema,
  validateMemberInviteBodySchema,
  validateMemberInviteResultSchema,
} from "../schemas/member-invite.schema";

export type MemberInviteCodeParams = z.infer<typeof memberInviteCodeParamsSchema>;

export type TeamInviteInviter = z.infer<typeof teamInviteInviterSchema>;

export type MemberInvitePreview = z.infer<typeof memberInvitePreviewSchema>;

export type CreateMemberInviteInput = z.infer<typeof createMemberInviteBodySchema>;

export type CreatedMemberInvite = z.infer<typeof createdMemberInviteSchema>;

export type ValidateMemberInviteInput = z.infer<typeof validateMemberInviteBodySchema>;

export type ValidateMemberInviteResult = z.infer<typeof validateMemberInviteResultSchema>;

export type AcceptMemberInviteInput = Partial<ValidateMemberInviteInput>;
