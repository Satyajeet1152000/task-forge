"use client";

import { useModal } from "@/context/ModelContext";
import { Button } from "../ui/button";
import { CirclePlusIcon } from "lucide-react";

const CreateTaskButton = () => {
    const { showModal } = useModal();
    return (
        <Button
            className=" space-x-2 w-full text-lg dark:text-white py-6 bg-gradient-to-b from-[#4C38C2] to-[#2F2188]"
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
            <span>Create new task</span>{" "}
            <CirclePlusIcon className=" fill-white text-[#2F2188]" />
        </Button>
    );
};

export default CreateTaskButton;
