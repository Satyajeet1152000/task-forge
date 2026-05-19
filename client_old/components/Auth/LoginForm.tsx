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
import { LoginSchema } from "@/lib/schema";
import FormSuccess from "../FormSuccess";
import login from "@/actions/auth/login";

const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [formSuccess, setFormSuccess] = useState({
        success: false,
        message: "",
    });

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        startTransition(async () => {
            const response = await login(values);

            setFormSuccess({
                success: response.success,
                message: response.success ? "" : (response.error as string),
            });
        });
    };

    return (
        <CardWrapper
            footerText="Don't have an account? Create a"
            footerHrefText="new account"
            footerHref="/register"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" space-y-6"
                >
                    <div className=" space-y-6">
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
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default LoginForm;
