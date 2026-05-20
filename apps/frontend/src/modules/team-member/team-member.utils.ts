import { Routes } from "@task-forge/shared/constant";

export function buildInviteRoute(code: string): string {
  return `${Routes.INVITE}/${code}`;
}

export function buildInvitePageRoute(code: string, email?: string): string {
  const path = buildInviteRoute(code);
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return path;
  }

  const params = new URLSearchParams({ email: normalizedEmail });

  return `${path}?${params.toString()}`;
}

export function buildSignupWithInviteRoute(code: string, email?: string): string {
  const params = new URLSearchParams({ invite: code });
  const normalizedEmail = email?.trim().toLowerCase();

  if (normalizedEmail) {
    params.set("email", normalizedEmail);
  }

  return `${Routes.SIGNUP}?${params.toString()}`;
}

export function buildLoginWithInviteRoute(code: string, email?: string): string {
  const params = new URLSearchParams({ invite: code });
  const normalizedEmail = email?.trim().toLowerCase();

  if (normalizedEmail) {
    params.set("email", normalizedEmail);
  }

  return `${Routes.LOGIN}?${params.toString()}`;
}
