import { messageResponse, successResponse } from "@lib/api-response";
import { clearAuthCookie, setAuthCookie } from "@lib/cookie.util";
import type { GoogleAuthInput, LoginInput, SignupInput } from "@task-forge/shared/types";
import type { FastifyReply, FastifyRequest } from "fastify";

import AuthService from "./auth.service";

export class AuthController {
  signup = async (
    request: FastifyRequest<{ Body: SignupInput }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { user, token } = await AuthService.signup(request.body);
    setAuthCookie(reply, token);
    return reply.status(201).send(successResponse(user, "Account created successfully"));
  };

  login = async (
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { user, token } = await AuthService.login(request.body);
    setAuthCookie(reply, token);
    return reply.status(200).send(successResponse(user, "Logged in successfully"));
  };

  googleAuth = async (
    request: FastifyRequest<{ Body: GoogleAuthInput }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { user, token } = await AuthService.googleAuth(request.body);
    setAuthCookie(reply, token);
    return reply.status(200).send(successResponse(user, "Authenticated with Google"));
  };

  logout = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    clearAuthCookie(reply);
    return reply.status(200).send(messageResponse("Logged out successfully"));
  };

  me = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = await AuthService.getCurrentUser(request.userId);
    return reply.status(200).send(successResponse(user));
  };
}
