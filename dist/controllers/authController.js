import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
/**
 * Login user and return JWT token
 * POST /api/auth/login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        let user = await User.findOne({ email });
        // If no user exists and this is the admin email from env, create admin user
        if (!user && email === process.env.ADMIN_EMAIL) {
            user = await User.create({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            });
            console.log("✅ Admin user created");
        }
        if (!user) {
            res.status(401).json({
                success: false,
                error: "Invalid credentials",
            });
            return;
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                error: "Invalid credentials",
            });
            return;
        }
        // Generate token
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
/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: "User already exists",
            });
            return;
        }
        // Create user
        const user = await User.create({ email, password });
        // Generate token
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
