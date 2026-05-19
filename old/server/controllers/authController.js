import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({ name, email, password });
        const token = jwt.sign(
            { id: user._id, name, email },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.status(201).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false, error: "User already exist" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, error: "Email not found" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: "365d",
            }
        );

        res.status(200).json({ success: true, token, id: user._id });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
