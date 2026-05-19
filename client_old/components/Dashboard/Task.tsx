import { RecordType } from "@/lib/schema";
import timeAgo from "@/lib/timeAgo";
import { cn } from "@/lib/utils";
import { Clock3, SquarePen, Star, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface TaskProps {
    data: RecordType;
    draggedElement: (_id: string, status: string) => void;
    onEdit: (data: RecordType) => void;
    onDelete: (data: RecordType) => void;
}
const Task = ({ data, draggedElement, onEdit, onDelete }: TaskProps) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        target.style.backgroundColor = "#d1d5db";

        return draggedElement(data._id, data.status);
    };
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        target.style.backgroundColor = "";
    };

    return (
        <div
            className={cn(
                "border-2 border-gray-200 dark:border-gray-600 rounded-lg flex flex-col p-3 gap-3",
                {}
            )}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* title and favrite icon */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl text-gray-600 dark:text-gray-200 font-semibold text-wrap">
                    {data.title}
                </h1>
                <Star
                    className={cn("text-gray-300", {
                        "text-yellow-500 fill-yellow-500": data.favorite,
                    })}
                />
            </div>

            <p className=" text-lg text-gray-600 dark:text-gray-400 w-full text-wrap">
                {data.description}
            </p>

            {/* Priority */}
            <div className=" w-full">
                <div
                    className={cn(
                        "w-fit px-3 py-1 text-white rounded-lg capitalize",
                        {
                            "bg-[#0ECC5A]": data.priority === "low",
                            "bg-[#ece13f]": data.priority === "medium",
                            "bg-[#e04b4b]": data.priority === "urgent",
                        }
                    )}
                >
                    {data.priority}
                </div>
            </div>

            {/* deadline */}
            <div className="flex space-x-2 text-gray-600 dark:text-gray-200 text-lg">
                <Clock3 />{" "}
                <span>{new Date(data.deadline).toLocaleDateString()}</span>
            </div>

            {/* timeAgo */}

            <div className="text-gray-500 flex items-center justify-between">
                <span>{timeAgo(data.createdAt)} ago</span>

                <span>
                    <Button
                        variant={"ghost"}
                        className="!p-0 !px-2 text-green-700"
                        onClick={() => onEdit(data)}
                    >
                        <SquarePen />
                    </Button>
                    <Button
                        variant={"ghost"}
                        className="!p-0 !px-2 text-red-700"
                        onClick={() => onDelete(data)}
                    >
                        <Trash2 />
                    </Button>
                </span>
            </div>
        </div>
    );
};

export default Task;
