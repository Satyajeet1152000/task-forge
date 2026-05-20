import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { SWAGGER_TAG_DISPLAY_ORDER } from "@task-forge/shared/constant";
import { env } from "@task-forge/shared/env";
import { RouteTags } from "@task-forge/shared/types";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

const OPENAPI_HTTP_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace",
] as const;

function removeUntaggedOperations(specification: Record<string, unknown>): Record<string, unknown> {
  const pathsUnknown = specification.paths;
  if (pathsUnknown === undefined || typeof pathsUnknown !== "object" || pathsUnknown === null) {
    return specification;
  }
  const pathMap = pathsUnknown as Record<string, Record<string, unknown>>;
  for (const pathKey of Object.keys(pathMap)) {
    const pathItem = pathMap[pathKey];
    if (pathItem === undefined) {
      continue;
    }
    for (const method of OPENAPI_HTTP_METHODS) {
      const operation = pathItem[method];
      if (operation === undefined || typeof operation !== "object" || operation === null) {
        continue;
      }
      const tags = (operation as { tags?: string[] }).tags;
      if (tags === undefined || tags.length === 0) {
        delete pathItem[method];
      }
    }
    const hasOperation = OPENAPI_HTTP_METHODS.some((method) => pathItem[method] !== undefined);
    if (!hasOperation) {
      delete pathMap[pathKey];
    }
  }
  return specification;
}

function orderOpenApiTags(specification: Record<string, unknown>): void {
  const discovered = new Set<string>();
  const pathsUnknown = specification.paths;
  if (pathsUnknown !== undefined && typeof pathsUnknown === "object" && pathsUnknown !== null) {
    const pathMap = pathsUnknown as Record<string, Record<string, unknown>>;
    for (const pathItem of Object.values(pathMap)) {
      if (pathItem === undefined || typeof pathItem !== "object") {
        continue;
      }
      for (const method of OPENAPI_HTTP_METHODS) {
        const operation = pathItem[method];
        if (operation === undefined || typeof operation !== "object" || operation === null) {
          continue;
        }
        const tags = (operation as { tags?: string[] }).tags;
        if (tags === undefined) {
          continue;
        }
        for (const tagName of tags) {
          discovered.add(tagName);
        }
      }
    }
  }
  const priorityList: RouteTags[] = SWAGGER_TAG_DISPLAY_ORDER;
  const prioritySet = new Set<string>(priorityList);
  const orderedPrioritized: string[] = [];
  for (const tag of priorityList) {
    if (discovered.has(tag)) {
      orderedPrioritized.push(tag);
    }
  }
  const remainder = [...discovered]
    .filter((name) => !prioritySet.has(name))
    .sort((a, b) => a.localeCompare(b));
  specification.tags = [...orderedPrioritized, ...remainder].map((name) => ({ name }));
}

function cloneSwaggerExample(example: unknown): unknown {
  if (example === null || typeof example !== "object") {
    return example;
  }
  return structuredClone(example);
}

function applyRequestBodyExampleFromRouteSchema(transformedSchema: Record<string, unknown>): void {
  const REQUEST_BODY_EXAMPLE_KEY = "requestBodyExample" as const;
  const exampleUnknown = transformedSchema[REQUEST_BODY_EXAMPLE_KEY];
  delete transformedSchema[REQUEST_BODY_EXAMPLE_KEY];
  if (exampleUnknown === undefined) {
    return;
  }
  const bodyUnknown = transformedSchema.body;
  if (bodyUnknown === undefined || typeof bodyUnknown !== "object" || bodyUnknown === null) {
    return;
  }
  const body = bodyUnknown as Record<string, unknown>;
  body.example = cloneSwaggerExample(exampleUnknown);
}

type JsonSchemaTransformParams = Parameters<typeof jsonSchemaTransform>[0];
type SwaggerTransformInput = JsonSchemaTransformParams & Record<string, unknown>;

const zodSwaggerTransform = (
  params: SwaggerTransformInput,
): ReturnType<typeof jsonSchemaTransform> => {
  const result = jsonSchemaTransform({
    schema: params.schema,
    url: params.url,
  });
  if (
    result.schema !== undefined &&
    (result.schema as { hide?: boolean }).hide !== true &&
    typeof result.schema === "object" &&
    result.schema !== null
  ) {
    applyRequestBodyExampleFromRouteSchema(result.schema as Record<string, unknown>);
  }
  return result;
};

async function swaggerPlugin(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    transform: zodSwaggerTransform,
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Task Forge API",
        description: "Task Forge backend API documentation",
        version: "0.1.0",
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: "Development server",
        },
        {
          url: `http://localhost:${env.PORT}`,
          description: "UAT server",
        },
        {
          url: `http://localhost:${env.PORT}`,
          description: "Production server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/api/docs",
    theme: {
      title: "Task Forge API",
    },
    uiConfig: {
      docExpansion: "none",
      deepLinking: false,
      persistAuthorization: true,
      tryItOutEnabled: true,
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: 0,
      displayOperationId: false,
      filter: true,
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) {
        next();
      },
      preHandler: function (_request, _reply, next) {
        next();
      },
    },
    transformSpecificationClone: true,
    transformSpecification: (swaggerObject) => {
      const spec = swaggerObject as Record<string, unknown>;
      removeUntaggedOperations(spec);
      orderOpenApiTags(spec);
      return swaggerObject;
    },
  });
}

export const registerSwagger = fp(swaggerPlugin, { name: "swagger" });
