import {
    ChartLine,
    HouseIcon,
    Settings,
    SquareKanbanIcon,
    Users,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const data = [
    { name: "Home", icon: <HouseIcon /> },
    { name: "Boards", icon: <SquareKanbanIcon /> },
    { name: "Settings", icon: <Settings /> },
    { name: "Teams", icon: <Users /> },
    { name: "Analytics", icon: <ChartLine /> },
];
const Menus = () => {
    return (
        <div className="flex flex-col gap-y-2">
            {data.map((d, i) => (
                <Button
                    key={i}
                    variant={"ghost"}
                    className=" w-full justify-start gap-x-3 text-gray-500 text-lg font-normal"
                >
                    {d.icon}
                    {d.name}
                </Button>
            ))}
        </div>
    );
};

export default Menus;
