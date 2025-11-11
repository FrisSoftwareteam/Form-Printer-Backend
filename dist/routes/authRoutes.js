import express from "express";
import { login, register } from "../controllers/authController.js";
import { loginValidation } from "../middleware/validation.js";
const router = express.Router();
router.post("/login", loginValidation, login);
router.post("/register", loginValidation, register);
export default router;
