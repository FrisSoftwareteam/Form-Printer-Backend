import mongoose, { Schema } from "mongoose";
const uploadMetadataSchema = new Schema({
    collectionName: {
        type: String,
        required: true,
        unique: true,
    },
    originalFileName: {
        type: String,
        required: true,
    },
    totalRows: {
        type: Number,
        required: true,
    },
    fields: [
        {
            type: String,
        },
    ],
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    uploadedBy: {
        type: String,
    },
});
export default mongoose.model("UploadMetadata", uploadMetadataSchema);
