"use client";
import Header from "./Header";
import InfoBar from "./InfoBar";
import TasksListSection from "./TasksListSection";
import CreateTaskModal from "../Create-New/CreateTaskModal";
import { ListUpdateProvider } from "@/context/ListUpdateContext";

const Dashboard = ({
    user,
}: {
    user: { id: string; name: string; email: string; token: string };
}) => {
    return (
        <ListUpdateProvider>
            <div className=" w-full h-full">
                <Header name={user?.name} />
                <InfoBar />
                <TasksListSection />
                <CreateTaskModal />
            </div>
        </ListUpdateProvider>
    );
};

export default Dashboard;
