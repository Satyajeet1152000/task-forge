import { z } from "zod";

import { RouteTags } from "../types/swagger.types";

import { successResponseSchema } from "./common-schemas";

export const userRoleSchema = z.enum(["USER", "ADMIN"]);

export const authProviderSchema = z.enum(["CREDENTIALS", "GOOGLE"]);

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable(),
  role: userRoleSchema,
  provider: authProviderSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const signupBodySchema = userSchema
  .omit({
    id: true,
    role: true,
    provider: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
    inviteToken: z.string().optional(),
  });

export const loginBodySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const googleAuthBodySchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
});

export const postSignupRouteSchema = {
  tags: [RouteTags.AUTH],
  summary: "Sign up",
  description: "Create a new account with email and password",
  body: signupBodySchema,
  requestBodyExample: {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    inviteToken: "123456",
  },
  response: {
    201: successResponseSchema(userSchema),
  },
};

export const postLoginRouteSchema = {
  tags: [RouteTags.AUTH],
  summary: "Log in",
  description: "Authenticate with email and password",
  body: loginBodySchema,
  requestBodyExample: {
    email: "john@example.com",
    password: "password123",
  },
  response: {
    200: successResponseSchema(userSchema),
  },
};

export const postGoogleAuthRouteSchema = {
  tags: [RouteTags.AUTH],
  summary: "Google authentication",
  description: "Authenticate or register using a Google ID token",
  body: googleAuthBodySchema,
  response: {
    200: successResponseSchema(userSchema),
  },
};

export const postLogoutRouteSchema = {
  tags: [RouteTags.AUTH],
  summary: "Log out",
  description: "Clear the authentication session",
  response: {
    200: z.object({
      success: z.literal(true),
      message: z.string(),
    }),
  },
};

export const getMeRouteSchema = {
  tags: [RouteTags.AUTH],
  summary: "Current user",
  description: "Return the authenticated user",
  response: {
    200: successResponseSchema(userSchema),
  },
};
