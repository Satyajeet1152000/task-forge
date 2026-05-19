import TaskLists from "./TaskLists";
import TaskToolbar from "./TaskToolbar";

const TasksListSection = () => {
    return (
        <div className=" space-y-5">
            <TaskToolbar />
            <TaskLists />
        </div>
    );
};

export default TasksListSection;
