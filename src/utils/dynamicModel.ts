import mongoose, { Schema, Model } from "mongoose";

/**
 * Create or get a dynamic Mongoose model based on headers
 * @param collectionName - Name of the MongoDB collection
 * @param headers - Array of field names from Excel headers
 * @returns Mongoose model
 */
export const getDynamicModel = (
  collectionName: string,
  headers: string[]
): Model<any> => {
  // Check if model already exists
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName];
  }

  // Create dynamic schema with all fields as mixed type
  const schemaDefinition: Record<string, any> = {};

  headers.forEach((header) => {
    schemaDefinition[header] = {
      type: Schema.Types.Mixed,
      index: true, // Create index for better search performance
    };
  });

  // Add metadata fields
  schemaDefinition.createdAt = {
    type: Date,
    default: Date.now,
  };

  const dynamicSchema = new Schema(schemaDefinition, {
    strict: false, // Allow additional fields
    timestamps: true,
  });

  // Create text indexes for common search fields
  const textIndexFields: Record<string, string> = {};
  headers.forEach((header) => {
    if (
      header.includes("name") ||
      header.includes("email") ||
      header.includes("phone")
    ) {
      textIndexFields[header] = "text";
    }
  });

  if (Object.keys(textIndexFields).length > 0) {
    dynamicSchema.index(textIndexFields as any);
  }

  return mongoose.model(collectionName, dynamicSchema);
};

/**
 * Bulk insert data into MongoDB collection
 * @param model - Mongoose model
 * @param data - Array of documents to insert
 * @param chunkSize - Number of documents per batch (default: 1000)
 */
export const bulkInsertData = async (
  model: Model<any>,
  data: Record<string, any>[],
  chunkSize: number = 1000
): Promise<number> => {
  let insertedCount = 0;

  // Process in chunks for better performance
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);

    try {
      const result = await model.insertMany(chunk, {
        ordered: false, // Continue on error
        lean: true,
      });
      insertedCount += result.length;
      console.log(
        `✅ Inserted chunk ${Math.floor(i / chunkSize) + 1}: ${
          result.length
        } documents`
      );
    } catch (error: any) {
      // Handle duplicate key errors gracefully
      if (error.writeErrors) {
        insertedCount += chunk.length - error.writeErrors.length;
        console.warn(
          `⚠️ Chunk ${Math.floor(i / chunkSize) + 1}: ${
            error.writeErrors.length
          } duplicates skipped`
        );
      } else {
        throw error;
      }
    }
  }

  return insertedCount;
};

/**
 * Clear all documents from a collection
 * @param model - Mongoose model
 */
export const clearCollection = async (model: Model<any>): Promise<number> => {
  const result = await model.deleteMany({});
  return result.deletedCount || 0;
};
