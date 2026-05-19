import UserAvatar from "./UserAvatar";
import Toolbar from "./Toolbar";
import Menus from "./Menus";
import { auth } from "@/auth/auth";
import CreateTaskButton from "./CreateTaskButton";

const Navbar = async () => {
    const data = await auth();
    return (
        <div className="px-3 py-5 space-y-2">
            <div>
                <UserAvatar
                    user={{
                        image: "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png",
                        name: data?.user.name as string,
                    }}
                />
                <Toolbar />
            </div>
            <Menus />
            <CreateTaskButton />
        </div>
    );
};

export default Navbar;
