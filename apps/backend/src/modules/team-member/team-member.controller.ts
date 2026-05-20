import { successResponse } from "@lib/api-response";
import type { AddTeamMemberInput, RemoveTeamMemberParams } from "@task-forge/shared/types";
import type { FastifyReply, FastifyRequest } from "fastify";

import TeamMemberService from "./team-member.service";

export class TeamMemberController {
  getAll = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const data = await TeamMemberService.getAll(request.userId);

    return reply.status(200).send(successResponse(data));
  };

  addMember = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = request.body as AddTeamMemberInput;
    const data = await TeamMemberService.addMember(request.userId, body.memberId);

    return reply.status(200).send(successResponse(data, "Team member added"));
  };

  removeMember = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const params = request.params as RemoveTeamMemberParams;
    const data = await TeamMemberService.removeMember(request.userId, params.memberId);

    return reply.status(200).send(successResponse(data, "Team member removed"));
  };
}
