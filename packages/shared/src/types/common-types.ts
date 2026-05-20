import type { FastifyPluginAsync } from "fastify";

export interface RouterConfig {
  endpoint: string;
  router: FastifyPluginAsync;
}

export enum LogType {
  INFO = "info",
  DEBUG = "debug",
  ERROR = "error",
  WARN = "warn",
  CRITICAL = "critical",
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
}

export type ApiErrorResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  error: string;
  requestId?: string;
  subErrors?: { path: string; message: string }[];
};

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  SUBSCRIPTION_EXPIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  TOO_MANY_REQUESTS = 429,
}
