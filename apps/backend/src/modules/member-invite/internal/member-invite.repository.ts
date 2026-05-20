import AppDataSource from "@database/data-source";

import { MemberInviteEntity } from "./member-invite.entity";

const MemberInviteRepository = AppDataSource.getRepository(MemberInviteEntity);

export default MemberInviteRepository;
