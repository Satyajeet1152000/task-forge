import { z } from "zod";

const envSchema = z.object({
  APP_NAME: z.string(),
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number(),
  FRONTEND_URL: z.string().url(),

  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_CA_CERT: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
