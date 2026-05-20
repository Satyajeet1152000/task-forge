import AppDataSource from "@database/data-source";

import { SubTaskEntity } from "./sub-task.entity";

const SubTaskRepository = AppDataSource.getRepository(SubTaskEntity);

export default SubTaskRepository;
