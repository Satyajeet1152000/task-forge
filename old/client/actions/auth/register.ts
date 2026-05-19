"use server";

import { RegisterSchema } from "@/lib/schema";
import { z } from "zod";

const register = async (values: z.infer<typeof RegisterSchema>) => {
    const response = await fetch(`${process.env.API_URL}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
    });

    const result = await response.json();

    return result;
};

export default register;
