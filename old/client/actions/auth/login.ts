"use server";

import { signIn } from "@/auth/auth";
import { LoginSchema } from "@/lib/schema";
import { AuthError } from "next-auth";
import { z } from "zod";

const login = async (values: z.infer<typeof LoginSchema>) => {
    try {
        await signIn("credentials", {
            ...values,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        // console.log("------------ Login function Error -------------");
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: "Invalid Credentials." };
                default:
                    return { success: false, error: error.cause?.err?.message };
            }
        }

        throw error;
    }

    return { success: true };
};

export default login;
