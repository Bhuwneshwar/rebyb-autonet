import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface TemporaryModel extends Document {
  id: string;
  FunName: string;
  Data: string;
  diamond: number;
  golden: number;
  UserId: ObjectId;
  referralCode: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TemporarySchema: Schema<TemporaryModel> = new Schema(
  {
    id: { type: String, unique: true },
    FunName: { type: String, required: true },
    Data: String,
    diamond: { type: Number },
    golden: { type: Number },
    UserId: { type: String },
    referralCode: String,
    amount: Number,
  },
  {
    timestamps: true,
  }
);

const Temporary = mongoose.model<TemporaryModel>("Temporary", TemporarySchema);

export default Temporary;
