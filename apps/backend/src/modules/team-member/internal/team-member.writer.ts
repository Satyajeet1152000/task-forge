import { TaskService } from "@modules/task";
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
    const normalizedMemberId = Number(memberId);
    const memberIds = [...new Set((record.members ?? []).map((id) => Number(id)))];

    if (memberIds.includes(normalizedMemberId)) {
      return TeamMemberWriter.serializeMemberList(userId, memberIds);
    }

    const memberExists = await UserService.userExists(normalizedMemberId);
    if (!memberExists) {
      throw new TeamMemberBadRequestError("User does not exist");
    }

    record.members = [...memberIds, normalizedMemberId];
    await TeamMemberRepository.save(record);

    return TeamMemberWriter.serializeMemberList(userId, record.members);
  }

  public static async removeMember(userId: number, memberId: number): Promise<TeamMembersList> {
    await TaskService.unassignMemberFromOwnerTasks(userId, memberId);

    const record = await TeamMemberRepository.findOne({ where: { userId } });
    if (!record) {
      return TeamMemberWriter.serializeMemberList(userId, []);
    }

    record.members = (record.members ?? []).filter((id) => Number(id) !== memberId);
    await TeamMemberRepository.save(record);

    return TeamMemberWriter.serializeMemberList(userId, record.members);
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

  private static async serializeMemberList(
    ownerUserId: number,
    memberIds: number[],
  ): Promise<TeamMembersList> {
    const normalizedMemberIds = memberIds.map((memberId) => Number(memberId));
    const members = await UserService.getUsersByIds(normalizedMemberIds);
    const statsByMemberId = await TaskService.getAssignmentStatsByMemberIds(
      ownerUserId,
      normalizedMemberIds,
    );

    return serializeTeamMembersList(members, statsByMemberId);
  }
}
