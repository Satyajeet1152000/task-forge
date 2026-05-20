import { z } from "zod";

import { RouteTags } from "../types/swagger.types";

import { successResponseSchema } from "./common-schemas";

export const teamMemberTaskStatsSchema = z.object({
  pending: z.number(),
  inProgress: z.number(),
  completed: z.number(),
});

export const teamMemberUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
  taskStats: teamMemberTaskStatsSchema,
});

export const teamMembersListSchema = z.object({
  members: z.array(teamMemberUserSchema),
});

export const addTeamMemberBodySchema = z.object({
  memberId: z.number().int().positive("Member id must be a positive integer"),
});

export const removeTeamMemberParamsSchema = z.object({
  memberId: z.coerce.number().int().positive("Member id must be a positive integer"),
});

export const getTeamMembersRouteSchema = {
  tags: [RouteTags.TEAM_MEMBERS],
  summary: "List team members",
  description: "Return all team members for the authenticated user",
  response: {
    200: successResponseSchema(teamMembersListSchema),
  },
};

export const postAddTeamMemberRouteSchema = {
  tags: [RouteTags.TEAM_MEMBERS],
  summary: "Add team member",
  description: "Add a user to the team members list",
  body: addTeamMemberBodySchema,
  response: {
    200: successResponseSchema(teamMembersListSchema),
  },
};

export const deleteRemoveTeamMemberRouteSchema = {
  tags: [RouteTags.TEAM_MEMBERS],
  summary: "Remove team member",
  description: "Remove a user from the team members list",
  params: removeTeamMemberParamsSchema,
  response: {
    200: successResponseSchema(teamMembersListSchema),
  },
};
