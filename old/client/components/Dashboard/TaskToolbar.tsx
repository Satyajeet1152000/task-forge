"use client";

import {
    Calendar,
    CirclePlusIcon,
    Filter,
    Search,
    Share,
    Sparkles,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SearchSchema } from "@/lib/schema";
import { useModal } from "@/context/ModelContext";

const TaskToolbar = () => {
    const form = useForm<z.infer<typeof SearchSchema>>({
        resolver: zodResolver(SearchSchema),
        defaultValues: {
            search: "",
        },
    });

    const { showModal } = useModal();

    return (
        <div className="text-gray-500 flex justify-between w-full">
            {/* Search */}
            <div className="w-fit ">
                <Form {...form}>
                    <form
                        action=""
                        className="border border-gray-300 flex rounded-lg"
                    >
                        <FormField
                            control={form.control}
                            name="search"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Search"
                                            className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none border-none focus-visible:ring-offset-0"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        ></FormField>
                        <Button
                            type="submit"
                            variant={"ghost"}
                            className=" border-none"
                        >
                            <Search />
                        </Button>
                    </form>
                </Form>
            </div>

            {/* left tools */}
            <div className="flex items-center text-lg gap-5">
                {[
                    { title: "Calender view", icon: <Calendar /> },
                    { title: "Automation", icon: <Sparkles /> },
                    { title: "Filter", icon: <Filter /> },
                    { title: "Share", icon: <Share /> },
                ].map((m, i) => (
                    <span key={i} className="flex gap-2">
                        {m.title} {m.icon}
                    </span>
                ))}
                <Button
                    className=" space-x-2 text-lg py-5 dark:text-white bg-gradient-to-b from-[#4C38C2] to-[#2F2188]"
                    onClick={() =>
                        showModal({
                            taskOperation: "create",
                            _id: "",
                            title: "",
                            status: "todo",
                            priority: "low",
                            deadline: new Date(),
                            description: "",
                            favorite: false,
                            user: "",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        })
                    }
                >
                    <span>Create new</span>{" "}
                    <CirclePlusIcon className=" fill-white text-[#2F2188]" />
                </Button>
            </div>
        </div>
    );
};

export default TaskToolbar;
