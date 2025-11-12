import multer from "multer";
import path from "path";
import fs from "fs";
const uploadsDir = "uploads/";
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Multer destination called");
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
        console.log(`Multer filename: ${filename}`);
        cb(null, filename);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".xlsx", ".xls"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only Excel files (.xlsx, .xls) are allowed"));
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});
