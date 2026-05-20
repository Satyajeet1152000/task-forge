import { cn } from "@/lib/utils";
import { Barlow } from "next/font/google";

const font = Barlow({
    subsets: ["latin"],
    weight: ["600"],
});

const Header = () => {
    return (
        <div className=" w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn("text-5xl font-semibold", font.className)}>
                Welcome to <span className="text-[#4534AC]">Trello</span>!
            </h1>
        </div>
    );
};

export default Header;
