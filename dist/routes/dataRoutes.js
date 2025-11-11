import express from "express";
import { searchByName, searchByField, getAllData, getStats, getCollections, getRecordById, } from "../controllers/dataController.js";
import { searchValidation } from "../middleware/validation.js";
import { validateApiKey } from "../middleware/auth.js";
const router = express.Router();
// Public routes (with API key)
// Search across name, email, mobile_no, account_number
// GET /api/search?query=John
router.get("/search", validateApiKey, searchValidation, searchByName);
// Search by specific field
// GET /api/search/name?value=John
// GET /api/search/email?value=test@example.com
// GET /api/search/mobile_no?value=08055671310
// GET /api/search/account_number?value=12596
router.get("/search/:field", validateApiKey, searchValidation, searchByField);
// Get all data from collection
// GET /api/data?collection=prescodatas
router.get("/data", validateApiKey, searchValidation, getAllData);
router.get("/stats", validateApiKey, getStats);
router.get("/collections", validateApiKey, getCollections);
// Public route (no authentication required)
// GET /api/fetch-with-account/12596
router.get("/fetch-with-account/:id", getRecordById);
export default router;
