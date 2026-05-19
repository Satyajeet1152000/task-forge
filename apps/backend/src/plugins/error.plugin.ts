import { AppError } from "@lib/error-handler";
import { getRequestId } from "@lib/get-request-id";
import { LogType, ApiErrorResponse, HttpStatusCode } from "@task-forge/shared/types";
import type { FastifyInstance, FastifyError } from "fastify";

const fastifyErrorCodesMap: Record<
  string,
  | ((error: FastifyError) => {
      statusCode: number;
      message: string;
      error: string;
      requestId?: string;
      subErrors?: { path: string; message: string }[];
    })
  | undefined
> = {
  FST_ERR_VALIDATION: (error: FastifyError) => ({
    ...error,
    subErrors: (error.validation ?? []).map((validationError) => ({
      path: validationError.instancePath,
      message: validationError.message ?? "",
    })),
    statusCode: HttpStatusCode.BAD_REQUEST,
    message: "Validation error",
    error: "Bad Request",
  }),

  FST_ERR_NOT_FOUND: () => ({
    message: "Not Found",
    error: "Not Found",
    statusCode: HttpStatusCode.NOT_FOUND,
  }),

  FST_ERR_RATE_LIMIT: (error: FastifyError) => ({
    ...error,
    statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
    error: error.code,
    message: "Too Many Requests",
  }),

  FST_ERR_RESPONSE_SERIALIZATION: (error: FastifyError) => ({
    ...error,
    statusCode: HttpStatusCode.BAD_REQUEST,
    error: error?.name || "ResponseSerializationError",
    message: error?.message || "Response serialization error",
  }),
};

export async function registerErrorHandler(app: FastifyInstance): Promise<void> {
  app.setErrorHandler((error: FastifyError | AppError, _request, res) => {
    const requestId = getRequestId();
    const isProd = process.env.NODE_ENV === "production";
    if ("code" in error) {
      const fastifyError = fastifyErrorCodesMap[error.code];
      if (fastifyError) {
        const response = fastifyError(error);
        response.requestId = requestId;
        app.log.error(response);
        return res.status(response.statusCode).send({
          success: false,
          statusCode: response.statusCode,
          message: response.message,
          error: response.error,
          ...(!isProd && {
            requestId: requestId,
            cause: error.cause,
            subErrors: response.subErrors,
          }),
        } satisfies ApiErrorResponse);
      }
    }

    switch (error instanceof AppError) {
      case true:
        switch ((error as AppError).logType) {
          case LogType.ERROR:
            app.log.error(error);
            break;
          case LogType.WARN:
            app.log.warn(error);
            break;
          case LogType.INFO:
            app.log.info(error);
            break;
          case LogType.DEBUG:
            app.log.debug(error);
            break;
          default:
            app.log.error(error);
            break;
        }
        break;
      default:
        app.log.error(error);
        break;
    }

    if (error instanceof AppError) {
      return res.status(error.statusCode).send({
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        error: error.error,
        ...(!isProd && { requestId: error.requestId }),
      } satisfies ApiErrorResponse);
    }

    return res.status(500).send({
      success: false,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      error: "Internal Server Error",
      ...(!isProd && { requestId: requestId }),
    } satisfies ApiErrorResponse);
  });
}
