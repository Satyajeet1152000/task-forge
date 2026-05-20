import type { z } from "zod";

import type {
  addTeamMemberBodySchema,
  removeTeamMemberParamsSchema,
  teamMemberUserSchema,
  teamMembersListSchema,
} from "../schemas/team-member.schema";

export type TeamMemberUser = z.infer<typeof teamMemberUserSchema>;

export type TeamMembersList = z.infer<typeof teamMembersListSchema>;

export type AddTeamMemberInput = z.infer<typeof addTeamMemberBodySchema>;

export type RemoveTeamMemberParams = z.infer<typeof removeTeamMemberParamsSchema>;
