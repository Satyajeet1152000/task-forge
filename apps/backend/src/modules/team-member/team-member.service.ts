import type { TeamMembersList } from "@task-forge/shared/types";

import TeamMemberReader from "./internal/team-member.reader";
import TeamMemberWriter from "./internal/team-member.writer";

export default class TeamMemberService {
  public static async getAll(userId: number): Promise<TeamMembersList> {
    return TeamMemberReader.getAllMembers(userId);
  }

  public static async addMember(userId: number, memberId: number): Promise<TeamMembersList> {
    return TeamMemberWriter.addMember(userId, memberId);
  }

  public static async removeMember(userId: number, memberId: number): Promise<TeamMembersList> {
    return TeamMemberWriter.removeMember(userId, memberId);
  }
}
