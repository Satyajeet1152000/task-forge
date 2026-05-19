"use client";

import { PriorityType, StatusType } from "@/lib/schema";
import { createContext, ReactNode, useContext, useState } from "react";

type ReceivedTaskType = {
    _id: string;
    title: string;
    status: StatusType;
    priority: PriorityType;
    deadline: Date;
    description?: string;
    favorite: boolean;
    user: string;
    createdAt: Date;
    updatedAt: Date;
    __v?: string;
};

interface Props {
    opt: "add" | "update" | "delete";
    tempId: string;
    data: ReceivedTaskType;
}

interface ListUpdateContextType {
    addNewList: ({ opt, tempId, data }: Props) => void;
    newListData: Props | null;

    // getNewList: ReceivedTaskType
}
const ListUpdateContext = createContext<ListUpdateContextType | undefined>(
    undefined
);

interface ListUpdateProviderProps {
    children: ReactNode;
}
export const ListUpdateProvider = ({ children }: ListUpdateProviderProps) => {
    const [newListData, setNewListData] = useState<Props | null>(null);

    const addNewList = ({ opt, tempId, data }: Props) => {
        setNewListData({ opt, tempId, data });
    };

    return (
        <ListUpdateContext.Provider value={{ addNewList, newListData }}>
            {children}
        </ListUpdateContext.Provider>
    );
};

export const useListUpdater = (): ListUpdateContextType => {
    const context = useContext(ListUpdateContext);
    if (!context) {
        throw new Error(
            "useListUpdater must be used within a ListUpdateProvider"
        );
    }
    return context;
};
