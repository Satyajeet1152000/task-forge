"use client";

import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormSuccess from "../FormSuccess";
import { RegisterSchema } from "@/lib/schema";
import register from "@/actions/auth/register";

const RegisterForm = () => {
    const [isPending, startTransition] = useTransition();
    const [formSuccess, setFormSuccess] = useState({
        success: false,
        message: "",
    });
    // const router = useRouter();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        startTransition(async () => {
            const result = await register(values);

            setFormSuccess({
                success: result.success,
                message: result.success
                    ? "Registration complete."
                    : result.error,
            });
        });
    };

    return (
        <CardWrapper
            footerText="Already have an account?"
            footerHrefText="Log in"
            footerHref="/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" space-y-6"
                >
                    <div className=" space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Full name"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Your eamil"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        {/* TODO: Change password text dot to asterisk */}
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Password"
                                            type="password"
                                            className=""
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormSuccess
                        success={formSuccess.success}
                        message={formSuccess.message}
                    />
                    <Button
                        type="submit"
                        className=" w-full bg-gradient-to-b from-[#4C38C2] to-[#2F2188] py-7 text-xl font-normal"
                        disabled={isPending}
                    >
                        Sign Up
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default RegisterForm;
