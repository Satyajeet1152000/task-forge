import { randomInt } from "node:crypto";

import MemberInviteRepository from "./internal/member-invite.repository";

const INVITE_CODE_MIN = 100000;
const INVITE_CODE_MAX = 1000000;
const MAX_CODE_GENERATION_ATTEMPTS = 10;

export async function generateUniqueInviteCode(): Promise<string> {
  for (let attempt = 0; attempt < MAX_CODE_GENERATION_ATTEMPTS; attempt += 1) {
    const code = String(randomInt(INVITE_CODE_MIN, INVITE_CODE_MAX));
    const existingCount = await MemberInviteRepository.count({ where: { code } });
    if (existingCount === 0) {
      return code;
    }
  }

  throw new Error("Failed to generate a unique invite code");
}
