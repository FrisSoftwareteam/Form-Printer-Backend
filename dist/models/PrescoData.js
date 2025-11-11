import mongoose, { Schema } from "mongoose";
const PrescoDataSchema = new Schema({
    s_no: { type: Number, required: true },
    account_number: { type: Number, required: true, index: true },
    name: { type: String, required: true, index: true },
    address: { type: String, required: true },
    units_held: { type: Number, required: true },
    rights_due: { type: Number, required: true },
    amount: { type: Number, required: true },
    mobile_no: { type: String, index: true },
    email: { type: String, index: true },
}, {
    collection: "prescodatas",
    timestamps: false,
});
// Create text index for better search performance
PrescoDataSchema.index({
    name: "text",
    email: "text",
    mobile_no: "text",
});
const PrescoData = mongoose.model("PrescoData", PrescoDataSchema);
export default PrescoData;
