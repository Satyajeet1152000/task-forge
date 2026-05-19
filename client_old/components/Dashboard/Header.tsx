import { cn } from "@/lib/utils";
import { CircleHelp } from "lucide-react";
import { Barlow } from "next/font/google";

const font = Barlow({
    subsets: ["latin"],
    weight: ["600"],
});
const Header = ({ name }: { name: string }) => {
    const greeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) {
            return "Good morning";
        } else if (hours < 18) {
            return "Good afternoon";
        } else {
            return "Good evening";
        }
    };
    return (
        <div className="flex items-center justify-between w-[100%]">
            <h1 className={cn(" text-4xl font-semibold", font.className)}>
                {greeting()}, {name.split(" ")[0]}!
            </h1>
            <div className="flex gap-3 text-xl">
                Help & Feedback <CircleHelp />
            </div>
        </div>
    );
};

export default Header;
