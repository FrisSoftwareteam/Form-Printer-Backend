import mongoose, { Schema, Document } from "mongoose";

export interface IPrescoData extends Document {
  s_no: number;
  account_number: number;
  name: string;
  address: string;
  units_held: number;
  rights_due: number;
  amount: number;
  mobile_no?: string;
  email?: string;
}

const PrescoDataSchema = new Schema<IPrescoData>(
  {
    s_no: { type: Number, required: true },
    account_number: { type: Number, required: true, index: true },
    name: { type: String, required: true, index: true },
    address: { type: String, required: true },
    units_held: { type: Number, required: true },
    rights_due: { type: Number, required: true },
    amount: { type: Number, required: true },
    mobile_no: { type: String, index: true },
    email: { type: String, index: true },
  },
  {
    collection: "prescodatas",
    timestamps: false,
  }
);

// Create text index for better search performance
PrescoDataSchema.index({
  name: "text",
  email: "text",
  mobile_no: "text",
});

const PrescoData = mongoose.model<IPrescoData>("PrescoData", PrescoDataSchema);

export default PrescoData;
