import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required.",
    }),
    password: z.string().min(1, {
        message: "Pasword is required.",
    }),
});

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required.",
    }),
    email: z.string().email({
        message: "Email is required.",
    }),
    password: z
        .string({
            message: "Pasword is required.",
        })
        .min(5, {
            message: "Minimum password length 5",
        }),
});

export const SearchSchema = z.object({
    search: z.string({
        message: "Full name is required.",
    }),
});

export const CreateNewTaskSchema = z.object({
    title: z.string().min(1, {
        message: "Required",
    }),
    status: z.enum(["todo", "inProgress", "underReview", "finished"], {
        message: "Required",
    }),
    priority: z.enum(["low", "medium", "urgent"], {
        message: "Required",
    }),
    deadline: z.date(),
    description: z.string().optional(),
    favorite: z.boolean().optional().default(false),
});

export type User = {
    id: string;
    name: string;
    email: string;
    token: string;
};

export type StatusType = "todo" | "inProgress" | "underReview" | "finished";
export type PriorityType = "low" | "medium" | "urgent";

export type RecordType = {
    _id: string;
    title: string;
    status: StatusType;
    priority: PriorityType;
    deadline: Date;
    description: string;
    favorite: boolean;
    user: string;
    createdAt: Date;
    updatedAt: Date;
    __v?: string;
};
