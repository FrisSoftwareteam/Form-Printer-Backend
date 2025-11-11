import mongoose from "mongoose";
import UploadMetadata from "../models/UploadMetadata.js";
import PrescoData from "../models/PrescoData.js";
/**
 * Search across multiple fields: name, email, mobile_no, account_number
 * GET /api/search?query=John
 */
export const searchByName = async (req, res) => {
    try {
        const { query, collection } = req.query;
        if (!query) {
            res.status(400).json({
                success: false,
                error: "Query parameter is required",
            });
            return;
        }
        const searchTerm = query;
        // Use prescodatas collection by default
        const collectionName = collection || "prescodatas";
        // Use PrescoData model for prescodatas collection
        if (collectionName === "prescodatas") {
            // Build search query for multiple fields
            const searchQuery = {
                $or: [
                    { name: { $regex: searchTerm, $options: "i" } },
                    { email: { $regex: searchTerm, $options: "i" } },
                    { mobile_no: { $regex: searchTerm, $options: "i" } },
                ],
            };
            // If search term is numeric, also search account_number
            if (!isNaN(Number(searchTerm))) {
                searchQuery.$or.push({ account_number: Number(searchTerm) });
            }
            const results = await PrescoData.find(searchQuery).lean();
            res.json({
                success: true,
                data: results,
                count: results.length,
            });
            return;
        }
        // Fallback to dynamic model for other collections
        const Model = mongoose.models[collectionName];
        if (!Model) {
            res.status(404).json({
                success: false,
                error: `Collection '${collectionName}' not found`,
            });
            return;
        }
        const nameFields = Object.keys(Model.schema.paths).filter((key) => key.toLowerCase().includes("name"));
        const searchQuery = {
            $or: nameFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        };
        const results = await Model.find(searchQuery).lean();
        res.json({
            success: true,
            data: results,
            count: results.length,
        });
    }
    catch (error) {
        console.error("Search error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Error searching data",
        });
    }
};
/**
 * Search by specific field
 * GET /api/search/:field?value=test
 */
export const searchByField = async (req, res) => {
    try {
        const { field } = req.params;
        const { value, collection } = req.query;
        if (!value) {
            res.status(400).json({
                success: false,
                error: "Value query parameter is required",
            });
            return;
        }
        const searchValue = value;
        const collectionName = collection || "prescodatas";
        // Use PrescoData model for prescodatas collection
        if (collectionName === "prescodatas") {
            const validFields = [
                "name",
                "email",
                "mobile_no",
                "account_number",
                "address",
                "s_no",
                "units_held",
                "rights_due",
                "amount",
            ];
            if (!validFields.includes(field)) {
                res.status(400).json({
                    success: false,
                    error: `Field '${field}' is not valid. Valid fields: ${validFields.join(", ")}`,
                });
                return;
            }
            let searchQuery;
            // Handle numeric fields
            if ([
                "account_number",
                "s_no",
                "units_held",
                "rights_due",
                "amount",
            ].includes(field)) {
                searchQuery = { [field]: Number(searchValue) };
            }
            else {
                searchQuery = { [field]: { $regex: searchValue, $options: "i" } };
            }
            const results = await PrescoData.find(searchQuery).lean();
            res.json({
                success: true,
                data: results,
                count: results.length,
            });
            return;
        }
        // Fallback to dynamic model for other collections
        const Model = mongoose.models[collectionName];
        if (!Model) {
            res.status(404).json({
                success: false,
                error: `Collection '${collectionName}' not found`,
            });
            return;
        }
        if (!Model.schema.paths[field]) {
            res.status(400).json({
                success: false,
                error: `Field '${field}' does not exist in collection`,
            });
            return;
        }
        const searchQuery = {
            [field]: { $regex: searchValue, $options: "i" },
        };
        const results = await Model.find(searchQuery).lean();
        res.json({
            success: true,
            data: results,
            count: results.length,
        });
    }
    catch (error) {
        console.error("Search error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Error searching data",
        });
    }
};
/**
 * Get all data without pagination
 * GET /api/data?collection=prescodatas
 */
export const getAllData = async (req, res) => {
    try {
        const { collection } = req.query;
        const collectionName = collection || "prescodatas";
        // Use PrescoData model for prescodatas collection
        if (collectionName === "prescodatas") {
            const results = await PrescoData.find({}).lean();
            res.json({
                success: true,
                data: results,
                count: results.length,
            });
            return;
        }
        // Fallback to dynamic model for other collections
        const Model = mongoose.models[collectionName];
        if (!Model) {
            res.status(404).json({
                success: false,
                error: `Collection '${collectionName}' not found`,
            });
            return;
        }
        const results = await Model.find({}).lean();
        res.json({
            success: true,
            data: results,
            count: results.length,
        });
    }
    catch (error) {
        console.error("Get data error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Error fetching data",
        });
    }
};
/**
 * Get statistics about uploaded collections
 * GET /api/stats
 */
export const getStats = async (req, res) => {
    try {
        const { collection } = req.query;
        let metadata;
        if (collection) {
            metadata = await UploadMetadata.findOne({ collectionName: collection });
        }
        else {
            metadata = await UploadMetadata.findOne().sort({ uploadedAt: -1 });
        }
        if (!metadata) {
            res.status(404).json({
                success: false,
                error: "No upload metadata found",
            });
            return;
        }
        res.json({
            success: true,
            stats: {
                collectionName: metadata.collectionName,
                originalFileName: metadata.originalFileName,
                totalRows: metadata.totalRows,
                fields: metadata.fields,
                uploadedAt: metadata.uploadedAt,
                uploadedBy: metadata.uploadedBy,
            },
        });
    }
    catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Error fetching stats",
        });
    }
};
/**
 * Get list of all collections
 * GET /api/collections
 */
export const getCollections = async (req, res) => {
    try {
        const collections = await UploadMetadata.find({}).sort({ uploadedAt: -1 });
        res.json({
            success: true,
            collections: collections.map((col) => ({
                name: col.collectionName,
                totalRows: col.totalRows,
                fields: col.fields,
                uploadedAt: col.uploadedAt,
            })),
        });
    }
    catch (error) {
        console.error("Collections error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Error fetching collections",
        });
    }
};
/**
 * Get single record by account_number
 * GET /api/fetch-with-account/:id
 */
export const getRecordById = async (req, res) => {
    try {
        const { id } = req.params;
        const { collection } = req.query;
        if (!id) {
            res.status(400).json({
                success: false,
                error: "Account number is required",
            });
            return;
        }
        const collectionName = collection || "prescodatas";
        // Use PrescoData model for prescodatas collection
        if (collectionName === "prescodatas") {
            const result = await PrescoData.findOne({
                account_number: Number(id),
            }).lean();
            if (!result) {
                res.status(404).json({
                    success: false,
                    error: "Record not found",
                });
                return;
            }
            res.json({
                success: true,
                data: result,
            });
            return;
        }
        // Fallback to dynamic model for other collections
        const Model = mongoose.models[collectionName];
        if (!Model) {
            res.status(404).json({
                success: false,
                error: `Collection '${collectionName}' not found`,
            });
            return;
        }
        if (!Model.schema.paths.account_number) {
            res.status(400).json({
                success: false,
                error: "account_number field does not exist in this collection",
            });
            return;
        }
        const result = await Model.findOne({ account_number: id }).lean();
        if (!result) {
            res.status(404).json({
                success: false,
                error: "Record not found",
            });
            return;
        }
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Get record error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Error fetching record",
        });
    }
};
