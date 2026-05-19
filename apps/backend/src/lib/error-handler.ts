import { getRequestId } from "@lib/get-request-id";
import { HttpStatusCode, LogType } from "@task-forge/shared/types";

export interface SerializedException {
  message: string;
  error: string;
  requestId: string;
  statusCode?: number;
  stack?: string;
  cause?: string;
  metadata?: unknown;
}

export type AppErrorProps = {
  message: string;
  error?: string;
  cause?: Error;
  metadata?: unknown;
  statusCode?: number;
  logType?: LogType;
};

export abstract class AppError extends Error {
  error: string;
  statusCode: number;
  logType: LogType;
  requestId: string;
  cause?: Error;
  metadata?: unknown;

  constructor(props: AppErrorProps) {
    super(props.message);
    this.error = props.error ?? "AppError";
    this.cause = props.cause;
    this.metadata = props.metadata;
    this.requestId = getRequestId();
    this.statusCode = props.statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR;
    this.logType = props.logType ?? LogType.ERROR;
  }

  toJSON(): SerializedException {
    return {
      message: this.message,
      error: this.error,
      statusCode: this.statusCode,
      stack: this.stack,
      requestId: this.requestId,
      cause: JSON.stringify(this.cause),
      metadata: this.metadata,
    };
  }
}
