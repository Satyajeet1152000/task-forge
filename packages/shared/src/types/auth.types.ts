import type { z } from "zod";

import type {
  googleAuthBodySchema,
  loginBodySchema,
  signupBodySchema,
  userSchema,
} from "../schemas/auth.schema";

export enum AuthProvider {
  CREDENTIALS = "CREDENTIALS",
  GOOGLE = "GOOGLE",
}

export type User = z.infer<typeof userSchema>;

export type SignupInput = z.infer<typeof signupBodySchema>;

export type LoginInput = z.infer<typeof loginBodySchema>;

export type GoogleAuthInput = z.infer<typeof googleAuthBodySchema>;

export interface AuthTokenPayload {
  sub: number;
  email: string;
}
