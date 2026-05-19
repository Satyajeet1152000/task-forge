import { AvatarProps } from "@radix-ui/react-avatar";
import Image from "next/image";
import { Avatar } from "../ui/avatar";
import { CircleUser } from "lucide-react";

type UserAvatarProps = Partial<AvatarProps> & {
    user: {
        name: string;
        image: string;
    };
};
const UserAvatar = ({ user, ...avatarProps }: UserAvatarProps) => {
    return (
        <div className="flex items-center gap-3">
            <Avatar
                className="relative h-10 w-10 border-1 bg-black  dark:bg-white"
                {...avatarProps}
            >
                {/* <Image
                    src={user.image}
                    alt={`${user?.name}'s profile picture`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-full object-cover w-full h-full"
                /> */}
                <CircleUser className=" w-full h-full text-white dark:text-black " />
            </Avatar>
            <h1 className="text-xl font-normal">{user?.name}</h1>
        </div>
    );
};

export default UserAvatar;
