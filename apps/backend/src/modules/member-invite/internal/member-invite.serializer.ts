import type {
  CreatedMemberInvite,
  MemberInvitePreview,
  TeamInviteInviter,
  User,
} from "@task-forge/shared/types";

import { MemberInviteEntity } from "./member-invite.entity";

export const serializeTeamInviteInviter = (user: User): TeamInviteInviter => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
};

export const serializeMemberInvitePreview = (
  invite: MemberInviteEntity,
  inviter: User,
): MemberInvitePreview => {
  return {
    code: invite.code,
    email: invite.email,
    expiresAt: invite.expiresAt.toISOString(),
    maxUses: invite.maxUses,
    usedCount: invite.usedCount,
    isActive: invite.isActive,
    inviter: serializeTeamInviteInviter(inviter),
  };
};

export const serializeCreatedMemberInvite = (invite: MemberInviteEntity): CreatedMemberInvite => {
  return {
    code: invite.code,
    expiresAt: invite.expiresAt.toISOString(),
    maxUses: invite.maxUses,
    email: invite.email,
  };
};
