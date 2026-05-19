import { ArrowUpNarrowWide } from "lucide-react";

const ListHeading = ({ heading }: { heading: string }) => {
    return (
        <div className=" w-full text-2xl text-gray-700 flex items-center justify-between py-2 px-5 dark:text-gray-100">
            <h1>{heading}</h1>
            <ArrowUpNarrowWide />
        </div>
    );
};

export default ListHeading;
