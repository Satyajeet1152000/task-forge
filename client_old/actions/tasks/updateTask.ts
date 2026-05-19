"use server";

import { auth } from "@/auth/auth";
import { PriorityType, StatusType } from "@/lib/schema";
interface UpdateTaskProps {
    title?: string;
    description?: string;
    status?: StatusType;
    priority?: PriorityType;
    favorite?: boolean;
    deadline?: Date;
}
export const updateTask = async (taskId: string, values: UpdateTaskProps) => {
    const data = await auth();

    const response = await fetch(`${process.env.API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.user.token}`,
        },
        body: JSON.stringify(values),
    });

    const result = await response.json();

    return result;
};
