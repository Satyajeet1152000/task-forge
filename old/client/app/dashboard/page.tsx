"use server";

import { auth } from "@/auth/auth";
import Dashboard from "@/components/Dashboard/Dashboard";

const DashboardPage = async () => {
    const data = await auth();

    return (
        <Dashboard
            user={{
                id: data?.user.id ?? "",
                name: data?.user.name ?? "",
                email: data?.user.email ?? "",
                token: data?.user.token ?? "",
            }}
        />
    );
};

export default DashboardPage;
