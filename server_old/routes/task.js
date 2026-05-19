import express from "express";
import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
} from "../controllers/taskController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protect, createTask);
router.route("/").get(protect, getTasks);

router.route("/:id").put(protect, updateTask);
router.route("/:id").delete(protect, deleteTask);

export default router;
