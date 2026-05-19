import { useModal } from "@/context/ModelContext";
import CreateNewTaskForm from "./CreateNewTaskForm";

const CreateTaskModal = () => {
    const { isModalOpen, hideModal, modalData } = useModal();

    if (!isModalOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-opacity-75 flex items-center justify-end overflow-y-hidden"
            onClick={hideModal}
        >
            <div
                className="relative h-full w-[600px]"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <CreateNewTaskForm
                    hideModal={hideModal}
                    modalData={modalData}
                />
            </div>
        </div>
    );
};

export default CreateTaskModal;
