import UserReader from "@modules/auth/internal/user.reader";
import TeamMemberService from "@modules/team-member/team-member.service";
import type {
  CreateMemberInviteInput,
  CreatedMemberInvite,
  TeamMembersList,
  ValidateMemberInviteInput,
} from "@task-forge/shared/types";

import { MemberInviteBadRequestError, MemberInviteNotFoundError } from "../member-invite.error";
import { generateUniqueInviteCode } from "../member-invite.util";

import { MemberInviteEntity } from "./member-invite.entity";
import MemberInviteReader from "./member-invite.reader";
import MemberInviteRepository from "./member-invite.repository";
import { serializeCreatedMemberInvite } from "./member-invite.serializer";

const DEFAULT_INVITE_MAX_USES = null;

export default class MemberInviteWriter {
  public static async createInvite(
    invitedById: number,
    input: CreateMemberInviteInput,
  ): Promise<CreatedMemberInvite> {
    const email = input.email?.trim().toLowerCase() ?? null;
    const expiresAt = new Date(input.expiresAt);
    const maxUses = input.maxUses ?? DEFAULT_INVITE_MAX_USES;

    if (Number.isNaN(expiresAt.getTime())) {
      throw new MemberInviteBadRequestError("Invalid expiration date");
    }

    if (expiresAt.getTime() <= Date.now()) {
      throw new MemberInviteBadRequestError("Expiration date must be in the future");
    }

    const code = await generateUniqueInviteCode();
    const invite = new MemberInviteEntity();

    invite.code = code;
    invite.invitedById = invitedById;
    invite.email = email;
    invite.expiresAt = expiresAt;
    invite.maxUses = maxUses;
    invite.usedCount = 0;
    invite.isActive = true;

    const savedInvite = await MemberInviteRepository.save(invite);

    return serializeCreatedMemberInvite(savedInvite);
  }

  public static async acceptInvite(
    code: string,
    userId: number,
    input: ValidateMemberInviteInput = { email: "" },
  ): Promise<TeamMembersList> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const authenticatedUser = await UserReader.getUserById(userId);
    const emailForValidation = normalizedEmail || authenticatedUser.email;

    if (normalizedEmail && authenticatedUser.email !== normalizedEmail) {
      throw new MemberInviteBadRequestError("Email does not match the authenticated account");
    }

    const invite = await MemberInviteReader.getInviteEntityByCode(code);
    const ownerUserId = Number(invite.invitedById);

    if (ownerUserId === userId) {
      throw new MemberInviteBadRequestError("You cannot accept your own invite");
    }

    const wasAlreadyMember = await TeamMemberService.isMember(ownerUserId, userId);

    if (wasAlreadyMember) {
      MemberInviteWriter.assertInviteEmailRestriction(invite, emailForValidation);

      return TeamMemberService.addMember(ownerUserId, userId);
    }

    MemberInviteWriter.assertInviteUsable(invite, emailForValidation);

    const teamMembers = await TeamMemberService.addMember(ownerUserId, userId);

    invite.usedCount += 1;
    await MemberInviteRepository.save(invite);

    return teamMembers;
  }

  public static async validateInviteForEmail(
    code: string,
    email: string,
  ): Promise<{ userExists: boolean }> {
    const invite = await MemberInviteRepository.findOne({ where: { code } });
    if (!invite) {
      throw new MemberInviteNotFoundError("Invite not found");
    }

    MemberInviteWriter.assertInviteUsable(invite, email);

    const userExists = await UserReader.emailExists(email);

    return { userExists };
  }

  private static assertInviteEmailRestriction(invite: MemberInviteEntity, email?: string): void {
    const normalizedEmail = email?.trim().toLowerCase();
    if (invite.email && normalizedEmail && invite.email !== normalizedEmail) {
      throw new MemberInviteBadRequestError("This invite is restricted to a different email address");
    }
  }

  private static assertInviteUsable(
    invite: MemberInviteEntity | null,
    email?: string,
  ): asserts invite is MemberInviteEntity {
    if (!invite) {
      throw new MemberInviteNotFoundError("Invite not found");
    }

    if (!invite.isActive) {
      throw new MemberInviteBadRequestError("This invite is no longer active");
    }

    if (invite.expiresAt.getTime() <= Date.now()) {
      throw new MemberInviteBadRequestError("This invite has expired");
    }

    if (invite.maxUses !== null && invite.usedCount >= invite.maxUses) {
      throw new MemberInviteBadRequestError("This invite has reached its usage limit");
    }

    MemberInviteWriter.assertInviteEmailRestriction(invite, email);
  }
}
