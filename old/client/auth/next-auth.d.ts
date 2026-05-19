/**
 * This is extented session for assingning user role
 */

import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    token: string;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }

    interface User {
        token: string;
    }
}
