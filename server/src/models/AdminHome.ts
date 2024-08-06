import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface AdminHomeModel extends Document {
  UserId: ObjectId;
  number: string;
  state: string;
  operator: string;
  plan: number;
  Type: string;
  transactionMethod: string;
  upi: string;
  ifsc: string;
  bank: string;
  Amount: number;
  extraData: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema: Schema<AdminHomeModel> = new Schema(
  {
    UserId: { type: String, required: true },
    number: { type: String },
    state: { type: String },
    operator: { type: String },
    plan: { type: Number },
    Type: { type: String, required: true },
    transactionMethod: { type: String },
    upi: { type: String },
    ifsc: { type: String },
    bank: { type: String },
    Amount: { type: Number, required: true },
    extraData: String,
  },
  {
    timestamps: true,
  }
);

const AdminHome = mongoose.model<AdminHomeModel>("AdminHome", adminSchema);

export default AdminHome;
