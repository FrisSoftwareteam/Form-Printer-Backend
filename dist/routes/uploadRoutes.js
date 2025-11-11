import express from "express";
import { upload } from "../config/multer.js";
import { uploadExcel, refreshData } from "../controllers/uploadController.js";
import { protect, validateApiKey } from "../middleware/auth.js";
const router = express.Router();
// Upload Excel file (protected route)
router.post("/upload", validateApiKey, protect, upload.single("file"), uploadExcel);
// Refresh data with new Excel file (protected route)
router.post("/refresh", validateApiKey, protect, upload.single("file"), refreshData);
export default router;
