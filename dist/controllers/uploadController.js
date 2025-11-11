import { parseExcelFile } from "../utils/excelParser.js";
import { getDynamicModel, bulkInsertData, clearCollection, } from "../utils/dynamicModel.js";
import UploadMetadata from "../models/UploadMetadata.js";
/**
 * Upload Excel file and create/update MongoDB collection
 * POST /api/upload
 */
export const uploadExcel = async (req, res) => {
    try {
        console.log("📤 Upload request received");
        console.log("File object:", req.file);
        console.log("Body:", req.body);
        if (!req.file) {
            res.status(400).json({
                success: false,
                error: "No file uploaded",
            });
            return;
        }
        const { collectionName } = req.body;
        const filePath = req.file.path;
        console.log(`📁 Processing file: ${req.file.originalname}`);
        console.log(`📍 File path: ${filePath}`);
        // Parse Excel file
        const { headers, rows, sheetName } = parseExcelFile(filePath);
        // Use provided collection name or sheet name
        const finalCollectionName = collectionName || sheetName;
        console.log(`📊 Creating/updating collection: ${finalCollectionName}`);
        // Get or create dynamic model
        const DynamicModel = getDynamicModel(finalCollectionName, headers);
        // Clear existing data in collection
        const deletedCount = await clearCollection(DynamicModel);
        console.log(`🗑️ Cleared ${deletedCount} existing documents`);
        // Bulk insert new data
        const insertedCount = await bulkInsertData(DynamicModel, rows);
        // Save metadata
        await UploadMetadata.findOneAndUpdate({ collectionName: finalCollectionName }, {
            collectionName: finalCollectionName,
            originalFileName: req.file.originalname,
            totalRows: insertedCount,
            fields: headers,
            uploadedAt: new Date(),
            uploadedBy: req.user?.email,
        }, { upsert: true, new: true });
        res.json({
            success: true,
            message: "File uploaded and processed successfully",
            data: {
                collectionName: finalCollectionName,
                totalRows: insertedCount,
                fields: headers,
                uploadedAt: new Date(),
            },
        });
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Error processing file",
        });
    }
};
/**
 * Refresh collection data with new Excel file
 * POST /api/refresh
 */
export const refreshData = async (req, res) => {
    // Same logic as uploadExcel
    await uploadExcel(req, res);
};
