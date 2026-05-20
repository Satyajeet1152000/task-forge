"use server";

import { auth } from "@/auth/auth";

export const deleteTask = async (taskId: string) => {
    const data = await auth();

    const response = await fetch(`${process.env.API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.user.token}`,
        },
    });

    const result = await response.json();

    return result;
};
