import { AppError, type AppErrorProps } from "@lib/error-handler";
import { HttpStatusCode, LogType } from "@task-forge/shared/types";

export class MemberInviteNotFoundError extends AppError {
  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super({
      message: message ?? "Invite not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      logType: LogType.WARN,
      cause,
      metadata,
    } satisfies AppErrorProps);
  }
}

export class MemberInviteBadRequestError extends AppError {
  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super({
      message: message ?? "Invalid invite request",
      statusCode: HttpStatusCode.BAD_REQUEST,
      logType: LogType.WARN,
      cause,
      metadata,
    } satisfies AppErrorProps);
  }
}
