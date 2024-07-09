import mongoose, { Schema, Document } from "mongoose";

export interface AdminHomeModel extends Document {
  UserId: string;
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
  timestamp: Date;
}

const adminSchema: Schema<AdminHomeModel> = new Schema({
  UserId: { type: String, required: true },
  number: { type: String, required: true },
  state: { type: String, required: true },
  operator: { type: String, required: true },
  plan: { type: Number, required: true },
  Type: { type: String, required: true },
  transactionMethod: { type: String, required: true },
  upi: { type: String },
  ifsc: { type: String },
  bank: { type: String },
  Amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const AdminHome = mongoose.model<AdminHomeModel>("AdminHome", adminSchema);

export default AdminHome;
