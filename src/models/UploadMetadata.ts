import mongoose, { Document, Schema } from "mongoose";

export interface IUploadMetadata extends Document {
  collectionName: string;
  originalFileName: string;
  totalRows: number;
  fields: string[];
  uploadedAt: Date;
  uploadedBy?: string;
}

const uploadMetadataSchema = new Schema<IUploadMetadata>({
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

export default mongoose.model<IUploadMetadata>(
  "UploadMetadata",
  uploadMetadataSchema
);
