export const SIGNUP_AVATAR_PATHS = Array.from(
  { length: 20 },
  (_, index) => `/img/avatars/avatar${index + 1}.jpg`,
) as readonly string[];

export function getRandomSignupAvatar(): string {
  const index = Math.floor(Math.random() * SIGNUP_AVATAR_PATHS.length);
  return SIGNUP_AVATAR_PATHS[index];
}
