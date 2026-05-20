import UserReader from "@modules/auth/internal/user.reader";
import type { MemberInvitePreview } from "@task-forge/shared/types";

import { MemberInviteNotFoundError } from "../member-invite.error";

import { MemberInviteEntity } from "./member-invite.entity";
import MemberInviteRepository from "./member-invite.repository";
import { serializeMemberInvitePreview } from "./member-invite.serializer";

export default class MemberInviteReader {
  public static async getInviteEntityByCode(code: string): Promise<MemberInviteEntity> {
    const invite = await MemberInviteRepository.findOne({ where: { code } });
    if (!invite) {
      throw new MemberInviteNotFoundError("Invite not found");
    }

    return invite;
  }

  public static async getInvitePreviewByCode(code: string): Promise<MemberInvitePreview> {
    const invite = await MemberInviteReader.getInviteEntityByCode(code);
    const inviter = await UserReader.getUserById(Number(invite.invitedById));

    return serializeMemberInvitePreview(invite, inviter);
  }
}
