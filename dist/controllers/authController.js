import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user && email === process.env.ADMIN_EMAIL) {
            user = await User.create({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            });
            console.log("Admin user created");
        }
        if (!user) {
            res.status(401).json({
                success: false,
                error: "Invalid credentials",
            });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                error: "Invalid credentials",
            });
            return;
        }
        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
        });
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            error: "Server error during login",
        });
    }
};
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: "User already exists",
            });
            return;
        }
        const user = await User.create({ email, password });
        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
        });
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            error: "Server error during registration",
        });
    }
};
