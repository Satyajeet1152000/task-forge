import { AppError, type AppErrorProps } from "@lib/error-handler";
import { HttpStatusCode, LogType } from "@task-forge/shared/types";

export class UserNotFoundError extends AppError {
  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super({
      message: message ?? "User not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      logType: LogType.WARN,
      cause,
      metadata,
    } satisfies AppErrorProps);
  }
}

export class UserEmailAlreadyExistsError extends AppError {
  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super({
      message: message ?? "Email already exists",
      statusCode: HttpStatusCode.CONFLICT,
      logType: LogType.WARN,
      cause,
      metadata,
    } satisfies AppErrorProps);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super({
      message: message ?? "Invalid email or password",
      statusCode: HttpStatusCode.UNAUTHORIZED,
      logType: LogType.WARN,
      cause,
      metadata,
    } satisfies AppErrorProps);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super({
      message: message ?? "Unauthorized",
      statusCode: HttpStatusCode.UNAUTHORIZED,
      logType: LogType.WARN,
      cause,
      metadata,
    } satisfies AppErrorProps);
  }
}

export class GoogleAuthError extends AppError {
  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super({
      message: message ?? "Google authentication failed",
      statusCode: HttpStatusCode.UNAUTHORIZED,
      logType: LogType.WARN,
      cause,
      metadata,
    } satisfies AppErrorProps);
  }
}
