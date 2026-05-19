import AppDataSource from "@database/data-source";

import { UserEntity } from "./user.entity";

const UserRepository = AppDataSource.getRepository(UserEntity);

export default UserRepository;
