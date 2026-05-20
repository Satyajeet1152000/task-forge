import { successResponse } from "@lib/api-response";
import type {
  AcceptMemberInviteInput,
  CreateMemberInviteInput,
  MemberInviteCodeParams,
  ValidateMemberInviteInput,
} from "@task-forge/shared/types";
import type { FastifyReply, FastifyRequest } from "fastify";

import MemberInviteService from "./member-invite.service";

export class MemberInviteController {
  createInvite = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = request.body as CreateMemberInviteInput;
    const data = await MemberInviteService.createInvite(request.userId, body);

    return reply.status(201).send(successResponse(data, "Invite created"));
  };

  getInviteByCode = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = request.params as MemberInviteCodeParams;
    const data = await MemberInviteService.getInviteByCode(params.code);

    return reply.status(200).send(successResponse(data));
  };

  validateInvite = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = request.params as MemberInviteCodeParams;
    const body = request.body as ValidateMemberInviteInput;
    const data = await MemberInviteService.validateInvite(params.code, body);

    return reply.status(200).send(successResponse(data));
  };

  acceptInvite = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = request.params as MemberInviteCodeParams;
    const body = (request.body ?? {}) as AcceptMemberInviteInput;
    const data = await MemberInviteService.acceptInvite(request.userId, params.code, body);

    return reply.status(200).send(successResponse(data, "You have joined the team"));
  };
}
