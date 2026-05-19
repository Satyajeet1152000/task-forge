"use server";

import { z } from "zod";
import { CreateNewTaskSchema } from "@/lib/schema";
import { auth } from "@/auth/auth";

export const createTask = async (
    values: z.infer<typeof CreateNewTaskSchema>
) => {
    const data = await auth();

    const response = await fetch(`${process.env.API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.user.token}`,
        },
        body: JSON.stringify(values),
    });

    const result = await response.json();

    return result;
};
