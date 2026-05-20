import { z } from "zod";

export function successResponseSchema<T extends z.ZodTypeAny>(
  dataSchema: T,
): z.ZodObject<{
  data: T;
  success: z.ZodLiteral<true>;
}> {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
  });
}
