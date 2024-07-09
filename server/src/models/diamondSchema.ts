import mongoose, { Schema, Document } from "mongoose";

export interface DiamondFundModel extends Document {
  _id: string;
  myId: number;
  userId: string;
  fund: number;
  reserveFund: number;
  orderId: string;
  paymentId: string;
  signature: string;
  fundReturnHistory: Array<{ many: number; when: Date }>;
  buyTime: Date;
}

const diamondSchema: Schema<DiamondFundModel> = new Schema({
  myId: { type: Number, unique: true },
  userId: { type: String, required: true },
  fund: { type: Number, default: 0 },
  reserveFund: { type: Number, default: 0 },
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  signature: { type: String, required: true },
  fundReturnHistory: [
    {
      many: { type: Number, required: true },
      when: { type: Date, required: true },
    },
  ],
  buyTime: { type: Date, default: Date.now },
});

const DiamondFund = mongoose.model<DiamondFundModel>(
  "DiamondFund",
  diamondSchema
);

export default DiamondFund;
