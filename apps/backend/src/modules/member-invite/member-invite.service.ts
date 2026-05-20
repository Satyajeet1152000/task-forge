import type {
  AcceptMemberInviteInput,
  CreateMemberInviteInput,
  CreatedMemberInvite,
  MemberInvitePreview,
  TeamMembersList,
  ValidateMemberInviteInput,
  ValidateMemberInviteResult,
} from "@task-forge/shared/types";

import MemberInviteReader from "./internal/member-invite.reader";
import MemberInviteWriter from "./internal/member-invite.writer";

export default class MemberInviteService {
  public static async createInvite(
    userId: number,
    input: CreateMemberInviteInput,
  ): Promise<CreatedMemberInvite> {
    return MemberInviteWriter.createInvite(userId, input);
  }

  public static async getInviteByCode(code: string): Promise<MemberInvitePreview> {
    return MemberInviteReader.getInvitePreviewByCode(code);
  }

  public static async validateInvite(
    code: string,
    input: ValidateMemberInviteInput,
  ): Promise<ValidateMemberInviteResult> {
    const invite = await MemberInviteReader.getInvitePreviewByCode(code);
    const { userExists } = await MemberInviteWriter.validateInviteForEmail(code, input.email);

    return {
      isValid: true,
      userExists,
      invite,
    };
  }

  public static async acceptInvite(
    userId: number,
    code: string,
    input: AcceptMemberInviteInput = {},
  ): Promise<TeamMembersList> {
    const email = input.email?.trim().toLowerCase() ?? "";
    const payload: ValidateMemberInviteInput = email ? { email } : { email: "" };

    return MemberInviteWriter.acceptInvite(code, userId, payload);
  }
}
