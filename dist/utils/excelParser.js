import xlsx from "xlsx";
import fs from "fs";
/**
 * Parse Excel file and extract headers and rows
 * @param filePath - Path to the Excel file
 * @param sheetIndex - Index of the sheet to parse (default: 0)
 * @returns Parsed data with headers, rows, and sheet name
 */
export const parseExcelFile = (filePath, sheetIndex = 0) => {
    try {
        // Verify file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        // Check file stats
        const stats = fs.statSync(filePath);
        console.log(`📊 File size: ${stats.size} bytes`);
        if (stats.size === 0) {
            throw new Error("File is empty");
        }
        // Read file as buffer (more reliable than readFile)
        const buffer = fs.readFileSync(filePath);
        const workbook = xlsx.read(buffer, { type: "buffer" });
        // Get the first sheet (or specified sheet)
        const sheetName = workbook.SheetNames[sheetIndex];
        const worksheet = workbook.Sheets[sheetName];
        // Convert sheet to JSON with header row
        const jsonData = xlsx.utils.sheet_to_json(worksheet, {
            defval: null,
        });
        if (jsonData.length === 0) {
            throw new Error("Excel file is empty or has no data rows");
        }
        // Extract headers from the first row keys
        const headers = Object.keys(jsonData[0]);
        // Clean up headers (remove spaces, special chars, make lowercase)
        const cleanHeaders = headers.map((header) => header
            .trim()
            .replace(/[^a-zA-Z0-9_]/g, "_")
            .toLowerCase());
        // Map rows with cleaned headers
        const rows = jsonData.map((row) => {
            const cleanedRow = {};
            headers.forEach((header, index) => {
                cleanedRow[cleanHeaders[index]] = row[header];
            });
            return cleanedRow;
        });
        console.log(`✅ Parsed ${rows.length} rows with ${cleanHeaders.length} columns from sheet: ${sheetName}`);
        return {
            headers: cleanHeaders,
            rows,
            sheetName: sheetName.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase(),
        };
    }
    catch (error) {
        console.error("Error parsing Excel file:", error);
        throw error;
    }
    finally {
        // Clean up uploaded file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};
