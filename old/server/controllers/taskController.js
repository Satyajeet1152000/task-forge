import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    const { title, description, status, priority, deadline, favorite } =
        req.body;
    const userId = req.user.id;

    try {
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            deadline,
            favorite,
            user: userId,
        });
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getTasks = async (req, res) => {
    const userId = req.user.id;

    try {
        const tasks = await Task.find({ user: userId });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const updateTask = async (req, res) => {
    const taskId = req.params.id;

    try {
        let task = await Task.findById(taskId);
        if (!task) {
            return res
                .status(404)
                .json({ success: false, error: "Task not found" });
        }

        task = await Task.findByIdAndUpdate(taskId, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res
                .status(404)
                .json({ success: false, error: "Task not found" });
        }

        if (task.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "Not authorized to delete this task",
            });
        }

        await Task.findByIdAndDelete(taskId);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
