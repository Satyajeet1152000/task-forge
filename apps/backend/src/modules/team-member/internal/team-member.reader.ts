import UserService from "@modules/auth/user.service";
import type { TeamMembersList } from "@task-forge/shared/types";

import TeamMemberRepository from "./team-member.repository";
import { serializeTeamMembersList } from "./team-member.serializer";

export default class TeamMemberReader {
  public static async getAllMembers(userId: number): Promise<TeamMembersList> {
    const record = await TeamMemberRepository.findOne({ where: { userId } });
    const memberIds = record?.members ?? [];
    const members = await UserService.getUsersByIds(memberIds);

    return serializeTeamMembersList(members);
  }
}
