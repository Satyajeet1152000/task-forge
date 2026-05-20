import type { ApiResponse } from "@task-forge/shared/types";

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, ...(message ? { message } : {}) };
}

export function messageResponse(message: string): ApiResponse<null> {
  return { success: true, message, data: null };
}
