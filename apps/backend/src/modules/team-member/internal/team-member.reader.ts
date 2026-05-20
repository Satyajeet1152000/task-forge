import UserService from "@modules/auth/user.service";
import { TaskService } from "@modules/task";
import type { TeamMembersList } from "@task-forge/shared/types";

import TeamMemberRepository from "./team-member.repository";
import { serializeTeamMembersList } from "./team-member.serializer";

export default class TeamMemberReader {
  public static async getAllMembers(userId: number): Promise<TeamMembersList> {
    const record = await TeamMemberRepository.findOne({ where: { userId } });
    const memberIds = (record?.members ?? []).map((memberId) => Number(memberId));
    const members = await UserService.getUsersByIds(memberIds);
    const statsByMemberId = await TaskService.getAssignmentStatsByMemberIds(userId, memberIds);

    return serializeTeamMembersList(members, statsByMemberId);
  }

  public static async isMember(ownerUserId: number, memberId: number): Promise<boolean> {
    const record = await TeamMemberRepository.findOne({ where: { userId: ownerUserId } });
    const normalizedMemberId = Number(memberId);

    return (record?.members ?? []).some((id) => Number(id) === normalizedMemberId);
  }
}
