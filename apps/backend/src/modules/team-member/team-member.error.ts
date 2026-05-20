import { AppError, type AppErrorProps } from "@lib/error-handler";
import { HttpStatusCode, LogType } from "@task-forge/shared/types";

export class TeamMemberNotFoundError extends AppError {
  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super({
      message: message ?? "Team member not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      logType: LogType.WARN,
      cause,
      metadata,
    } satisfies AppErrorProps);
  }
}

export class TeamMemberBadRequestError extends AppError {
  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super({
      message: message ?? "Invalid team member request",
      statusCode: HttpStatusCode.BAD_REQUEST,
      logType: LogType.WARN,
      cause,
      metadata,
    } satisfies AppErrorProps);
  }
}
