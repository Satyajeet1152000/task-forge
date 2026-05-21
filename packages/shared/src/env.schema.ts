import { z } from "zod";

const envSchema = z.object({
  APP_NAME: z.string(),
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number(),

  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_CA_CERT: z.string().optional(),

  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  AUTH_COOKIE_NAME: z.string().default("task_forge_auth"),

  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
