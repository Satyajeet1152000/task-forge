import { AppError, type AppErrorProps } from "@lib/error-handler";
import { HttpStatusCode, LogType } from "@task-forge/shared/types";

export class TaskNotFoundError extends AppError {
  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super({
      message: message ?? "Task not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      logType: LogType.WARN,
      cause,
      metadata,
    } satisfies AppErrorProps);
  }
}
