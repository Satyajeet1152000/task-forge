import UserService from "@modules/auth/user.service";
import type { TeamMembersList } from "@task-forge/shared/types";

import { TeamMemberBadRequestError } from "../team-member.error";

import { TeamMemberEntity } from "./team-member.entity";
import TeamMemberRepository from "./team-member.repository";
import { serializeTeamMembersList } from "./team-member.serializer";

export default class TeamMemberWriter {
  public static async addMember(userId: number, memberId: number): Promise<TeamMembersList> {
    if (userId === memberId) {
      throw new TeamMemberBadRequestError("You cannot add yourself as a team member");
    }

    const record = await TeamMemberWriter.getOrCreateRecord(userId);
    const memberIds = [...(record.members ?? [])];

    if (memberIds.includes(memberId)) {
      return TeamMemberWriter.serializeMemberList(memberIds);
    }

    const memberExists = await UserService.userExists(memberId);
    if (!memberExists) {
      throw new TeamMemberBadRequestError("User does not exist");
    }

    record.members = [...memberIds, memberId];
    await TeamMemberRepository.save(record);

    return TeamMemberWriter.serializeMemberList(record.members);
  }

  public static async removeMember(userId: number, memberId: number): Promise<TeamMembersList> {
    const record = await TeamMemberRepository.findOne({ where: { userId } });
    if (!record) {
      return serializeTeamMembersList([]);
    }

    record.members = (record.members ?? []).filter((id) => Number(id) !== memberId);
    await TeamMemberRepository.save(record);

    return TeamMemberWriter.serializeMemberList(record.members);
  }

  private static async getOrCreateRecord(userId: number): Promise<TeamMemberEntity> {
    const existing = await TeamMemberRepository.findOne({ where: { userId } });
    if (existing) {
      return existing;
    }

    const record = new TeamMemberEntity();
    record.userId = userId;
    record.members = [];

    return TeamMemberRepository.save(record);
  }

  private static async serializeMemberList(memberIds: number[]): Promise<TeamMembersList> {
    const members = await UserService.getUsersByIds(memberIds);

    return serializeTeamMembersList(members);
  }
}
