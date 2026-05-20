import AppDataSource from "@database/data-source";

import { TaskEntity } from "./task.entity";

const TaskRepository = AppDataSource.getRepository(TaskEntity);

export default TaskRepository;
