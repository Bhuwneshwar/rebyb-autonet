import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface PaymentHistoryModel extends Document {
  _id: ObjectId;
  userId: string;
  amount: number;
  orderId: string;
  paymentId: string;
  signature: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentHistory: Schema<PaymentHistoryModel> = new Schema(
  {
    userId: { type: String },
    amount: { type: Number, required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    signature: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PaymentHistory = mongoose.model<PaymentHistoryModel>(
  "PaymentHistory",
  paymentHistory
);

export default PaymentHistory;
