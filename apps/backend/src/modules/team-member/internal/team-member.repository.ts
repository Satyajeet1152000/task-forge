import AppDataSource from "@database/data-source";

import { TeamMemberEntity } from "./team-member.entity";

const TeamMemberRepository = AppDataSource.getRepository(TeamMemberEntity);

export default TeamMemberRepository;
