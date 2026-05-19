import { Skeleton } from "./ui/skeleton";

export function ListSkeleton() {
    const color = "#dfdfdf";
    return (
        <Skeleton className="border-2 border-gray-200 rounded-lg flex flex-col p-3 gap-3">
            {/* title and favrite icon */}
            <div className="flex items-center justify-between gap-3">
                {/* titlt */}
                <Skeleton className={`h-8 w-full bg-[${color}]`} />
                {/* fav icon */}
                <Skeleton className={`h-8 w-8 bg-[${color}]`} />
            </div>

            {/* description */}
            <div className=" space-y-1">
                <Skeleton className={`h-5 w-full bg-[${color}]`} />
                <Skeleton className={`h-5 w-full bg-[${color}]`} />
                <Skeleton className={`h-5 w-full bg-[${color}]`} />
                <Skeleton className={`h-5 w-full bg-[${color}]`} />
                <Skeleton className={`h-5 w-full bg-[${color}]`} />
            </div>

            {/* Priority */}
            <Skeleton className={`h-10 w-24 bg-[${color}]`} />

            {/* deadline */}
            <div className="flex space-x-2 items-center">
                {/* clock */}
                <Skeleton className={`h-8 w-8 bg-[${color}] rounded-full`} />
                {/* time */}
                <Skeleton className={`h-5 w-24 bg-[${color}]`} />
            </div>

            {/* timeAgo */}
            <Skeleton className={`h-5 w-32 bg-[${color}]`} />
        </Skeleton>
    );
}

export function UserAvatar() {
    return <Skeleton className="w-8 h-8 rounded-full" />;
}
export function UserName() {
    return <Skeleton className="h-5 w-24" />;
}
