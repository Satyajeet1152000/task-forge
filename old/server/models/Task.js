import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ["todo", "inProgress", "underReview", "finished"],
            required: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "urgent"],
            default: null,
        },
        deadline: {
            type: Date,
        },
        favorite: {
            type: Boolean,
            default: false,
            require: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
