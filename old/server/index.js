import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
mongoose.set("strictQuery", false);

// =================== Middleware ====================
app.use(bodyParser.json());
app.use(cors());

// ================= Routes =================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// invalid routes error handling
app.use((req, res) => {
    // Invalid request
    res.json({
        error: {
            message: "Invalid Request",
            statusCode: 404,
        },
    });
});

// Database connection
mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("Mongoose Database connected successfully.");
        app.listen(PORT, () => {
            console.log(`Server is listinning on port : ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Mongoose Database connection error. : ${err}`);
    });
