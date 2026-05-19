"use client";

import { PriorityType, StatusType } from "@/lib/schema";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

export interface ModelDataType {
    taskOperation: "create" | "update";
    _id: string;
    title: string;
    status: StatusType;
    priority: PriorityType;
    deadline: Date;
    description: string;
    favorite: boolean;
    user: string;
    createdAt: Date;
    updatedAt: Date;
    __v?: string;
}

interface ModalContextType {
    isModalOpen: boolean;
    showModal: (data?: ModelDataType) => void;
    hideModal: () => void;
    modalData: ModelDataType | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<ModelDataType | null>(null);

    // hide scrollbar
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.overflowX = "hidden";
        } else {
            document.body.style.overflow = "auto";
            document.body.style.overflowX = "hidden";
        }
    }, [isModalOpen]);

    const showModal = (data?: ModelDataType) => {
        setModalData(data || null);
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setModalData(null);
        setIsModalOpen(false);
    };

    return (
        <ModalContext.Provider
            value={{ isModalOpen, modalData, showModal, hideModal }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
