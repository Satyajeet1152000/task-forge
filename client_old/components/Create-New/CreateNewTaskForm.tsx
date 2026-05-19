"use client";

import { useState, useTransition } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateNewTaskSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import {
    CalendarIcon,
    Loader,
    Maximize2,
    Pencil,
    Plus,
    Share2,
    Star,
    TriangleAlert,
    X,
} from "lucide-react";
import { format } from "date-fns";
import { ModelDataType } from "@/context/ModelContext";
import { useListUpdater } from "@/context/ListUpdateContext";
import { createTask } from "@/actions/tasks/createTask";
import { updateTask } from "@/actions/tasks/updateTask";

interface Props {
    hideModal: () => void;
    modalData: ModelDataType | null;
}

const CreateNewTaskForm = ({ hideModal, modalData }: Props) => {
    const form = useForm<z.infer<typeof CreateNewTaskSchema>>({
        resolver: zodResolver(CreateNewTaskSchema),
        defaultValues: {
            favorite: false,
            title: modalData?.title ?? "",
            status: modalData?.status ?? undefined,
            priority: modalData?.priority ?? undefined,
            deadline: modalData?.deadline ?? undefined,
            description: modalData?.description ?? "",
        },
    });

    const [isPending, startTransition] = useTransition();

    const { addNewList } = useListUpdater();

    const CreateNewList = (values: z.infer<typeof CreateNewTaskSchema>) => {
        const tempId = crypto.randomUUID();
        addNewList({
            opt: "add",
            tempId,
            data: {
                ...values,
                _id: tempId,
                user: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        hideModal();

        startTransition(async () => {
            const response = await createTask(values);

            if (response.success) {
                addNewList({
                    opt: "update",
                    tempId,
                    data: response.data,
                });
            } else {
                addNewList({
                    opt: "delete",
                    tempId,
                    data: {
                        ...values,
                        _id: "",
                        user: "",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
            }
        });
    };

    const UpdateTask = (values: z.infer<typeof CreateNewTaskSchema>) => {
        //modal null error handling
        if (!modalData) return null;

        // optimitically update list
        addNewList({
            opt: "update",
            tempId: modalData?._id,
            data: {
                ...values,
                _id: modalData._id,
                user: modalData.user,
                createdAt: modalData.createdAt,
                updatedAt: modalData.updatedAt,
            },
        });

        hideModal();

        startTransition(async () => {
            const response = await updateTask(modalData._id, values);

            if (response.success) {
                addNewList({
                    opt: "update",
                    tempId: modalData?._id,
                    data: response.data,
                });
            } else {
                const { taskOperation, ...rest } = modalData;
                addNewList({
                    opt: "update",
                    tempId: modalData?._id,
                    data: rest,
                });
            }
        });
    };
    const onSubmit = (values: z.infer<typeof CreateNewTaskSchema>) => {
        if (modalData?.taskOperation === "create") {
            CreateNewList(values);
        }

        if (modalData?.taskOperation === "update") {
            UpdateTask(values);
        }
    };

    const [favBtn, setFavBtn] = useState(modalData?.favorite ?? false);

    const [popoverOpen, setPopoverOpen] = useState(false);
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-6 p-5 bg-white dark:bg-[#0f2031] h-full w-full"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <Button
                            onClick={hideModal}
                            variant={"ghost"}
                            className=""
                            type="button"
                        >
                            <X />
                        </Button>
                        <Button variant={"ghost"} className="text-gray-500 ">
                            <Maximize2 className=" rotate-90" />
                        </Button>
                    </div>

                    {/* Favorite */}
                    <FormField
                        control={form.control}
                        name="favorite"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className=" space-x-5">
                                        <Button
                                            variant={"ghost"}
                                            className="text-gray-500 space-x-2 text-xl bg-gray-100"
                                        >
                                            <span>Share</span>
                                            <Share2 />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="text-gray-500 space-x-2 text-xl bg-gray-100"
                                            onClick={() => {
                                                setFavBtn(!favBtn);
                                                form.setValue(
                                                    "favorite",
                                                    !favBtn
                                                );
                                            }}
                                        >
                                            <span>Favorite</span>
                                            <Star
                                                className={cn("text-gray-400", {
                                                    "text-yellow-500 fill-yellow-500":
                                                        favBtn === true,
                                                })}
                                            />
                                        </Button>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="Title"
                                    type="text"
                                    className="h-20 placeholder:text-5xl text-3xl placeholder:text-gray-300 font-semibold"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col gap-3">
                    {/* Status */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex">
                                    <FormLabel className="flex items-center space-x-5 w-44 text-gray-500 text-lg">
                                        <Loader />
                                        <span>Status</span>
                                    </FormLabel>

                                    <div className="flex-grow">
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className=" text-gray-700  text-md">
                                                    <SelectValue
                                                        placeholder="Not Selected"
                                                        className=" w-full"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[
                                                    { t: "To do", v: "todo" },
                                                    {
                                                        t: "In Progress",
                                                        v: "inProgress",
                                                    },
                                                    {
                                                        t: "Under Review",
                                                        v: "underReview",
                                                    },
                                                    {
                                                        t: "Finished",
                                                        v: "finished",
                                                    },
                                                ].map((d, i) => (
                                                    <SelectItem
                                                        key={i}
                                                        value={d.v}
                                                        className="text-lg text-gray-500"
                                                    >
                                                        {d.t}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Priority */}
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex">
                                    <FormLabel className="flex items-center space-x-5 w-44 text-gray-500 text-lg">
                                        <TriangleAlert />
                                        <span>Priority</span>
                                    </FormLabel>
                                    <div className="flex-grow">
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className=" text-gray-700  text-md">
                                                    <SelectValue placeholder="Not Selected" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[
                                                    "low",
                                                    "medium",
                                                    "urgent",
                                                ].map((d, i) => (
                                                    <SelectItem
                                                        value={d}
                                                        key={i}
                                                    >
                                                        <span className=" capitalize text-md text-lg text-gray-700">
                                                            {d}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Deadline */}
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <div className="flex">
                                    <FormLabel className="flex items-center space-x-5 w-44 text-gray-500 text-lg">
                                        <CalendarIcon />
                                        <span>Deadline</span>
                                    </FormLabel>
                                    <div className="flex-grow">
                                        <Popover
                                            open={popoverOpen}
                                            onOpenChange={(open) =>
                                                setPopoverOpen(open)
                                            }
                                        >
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal text-gray-700 text-md",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP"
                                                            )
                                                        ) : (
                                                            <span>
                                                                Not Selected
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    // selected={field.value}
                                                    onSelect={(date) => {
                                                        field.onChange(date);
                                                        setPopoverOpen(false); // Close the popover
                                                    }}
                                                    disabled={(date) =>
                                                        date < new Date() ||
                                                        date >
                                                            new Date(
                                                                new Date().setFullYear(
                                                                    new Date().getFullYear() +
                                                                        5
                                                                )
                                                            )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex">
                                    <FormLabel className="flex items-center space-x-5 w-44 text-gray-500 text-lg">
                                        <Pencil />
                                        <span>Description</span>
                                    </FormLabel>
                                    <div className="flex-grow">
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Not Added"
                                                className="text-md text-gray-700 "
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Add custom rpoperty */}
                    <div className="flex">
                        <div className="flex items-center space-x-5 text-balck text-lg">
                            <Plus />
                            <span>Add custom property</span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className=" space-x-2 w-fit text-lg py-6 capitalize bg-gradient-to-b from-[#4C38C2] to-[#2F2188]"
                        disabled={isPending}
                    >
                        {modalData?.taskOperation} Task
                    </Button>

                    {/* breakpoint */}
                    <div className="border-t-2 border-gray-200 text-gray-300 mt-5 pt-5">
                        Start writing, or drag your own files here.
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default CreateNewTaskForm;
