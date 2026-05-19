import { signToken } from "@lib/jwt.util";
import { verifyPassword } from "@lib/password.util";
import { env } from "@task-forge/shared/env";
import type {
  GoogleAuthInput,
  AuthTokenPayload,
  LoginInput,
  SignupInput,
  User,
} from "@task-forge/shared/types";
import { UserRole } from "@task-forge/shared/types";
import { OAuth2Client } from "google-auth-library";

import { GoogleAuthError, InvalidCredentialsError } from "./auth.error";
import UserReader from "./internal/user.reader";
import UserRepository from "./internal/user.repository";
import UserWriter from "./internal/user.writer";

export default class AuthService {
  public static async signup(input: SignupInput): Promise<{ user: User; token: string }> {
    await UserReader.assertEmailAvailable(input.email);

    const user = await UserWriter.createCredentialUser(input);
    const token = signToken(this.buildJwtPayload(user));

    return { user, token };
  }

  public static async login(input: LoginInput): Promise<{ user: User; token: string }> {
    const entity = await UserRepository.findOne({
      where: { email: input.email.trim().toLowerCase() },
    });

    if (!entity || !entity.password) {
      throw new InvalidCredentialsError();
    }

    const isValid = await verifyPassword(input.password, entity.password);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const user = await UserReader.getUserById(Number(entity.id));
    const token = signToken(this.buildJwtPayload(user));

    return { user, token };
  }

  public static async googleAuth(
    input: GoogleAuthInput,
  ): Promise<{ user: User; token: string; isNewUser: boolean }> {
    const payload = await this.verifyGoogleCredential(input.credential);

    const email = payload.email?.trim().toLowerCase();
    if (!email) {
      throw new GoogleAuthError("Google account email is required");
    }

    const existing = await UserReader.getUserByEmail(email);
    if (existing) {
      const token = signToken(this.buildJwtPayload(existing));
      return { user: existing, token, isNewUser: false };
    }

    const user = await UserWriter.createGoogleUser({
      name: payload.name ?? email.split("@")[0],
      email,
      image: payload.picture ?? null,
    });

    const token = signToken(this.buildJwtPayload(user));

    return { user, token, isNewUser: true };
  }

  public static async getCurrentUser(userId: number): Promise<User> {
    return UserReader.getUserById(userId);
  }

  private static buildJwtPayload(user: User): AuthTokenPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
    };
  }

  private static async verifyGoogleCredential(credential: string): Promise<{
    email?: string;
    name?: string;
    picture?: string;
  }> {
    if (!env.GOOGLE_CLIENT_ID) {
      throw new GoogleAuthError("Google OAuth is not configured");
    }
    const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new GoogleAuthError();
      }
      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      throw new GoogleAuthError(
        "Google authentication failed",
        error instanceof Error ? error : undefined,
      );
    }
  }
}
