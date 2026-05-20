import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useModal } from "@/context/ModelContext";
import { StatusType } from "@/lib/schema";

const AddNewButton = ({ value }: { value: StatusType }) => {
    const { showModal } = useModal();
    return (
        <Button
            className=" space-x-2 text-lg py-6 bg-gradient-to-b from-[#3A3A3A] dark:from-[#8b8b8b]  to-[#202020] w-full flex items-center justify-between"
            onClick={() =>
                showModal({
                    taskOperation: "create",
                    _id: "",
                    title: "",
                    status: value,
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
            <span>Create new</span> <PlusIcon className=" fill-[#202020] " />
        </Button>
    );
};

export default AddNewButton;
