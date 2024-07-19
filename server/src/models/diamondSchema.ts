import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface DiamondFundModel extends Document {
  _id: ObjectId;
  myId: number;
  userId: string;
  fund: number;
  reserveFund: number;
  orderId: string;
  paymentId: string;
  signature: string;
  fundReturnHistory: Array<{ many: number; when: Date; who: number }>;
  buyTime: Date;
}

const diamondSchema: Schema<DiamondFundModel> = new Schema(
  {
    myId: { type: Number, unique: true },
    userId: { type: String, required: true },
    fund: { type: Number, default: 0 },
    reserveFund: { type: Number, default: 0 },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    signature: { type: String, required: true },
    fundReturnHistory: [
      {
        amound: { type: Number, required: true },
        date: { type: Date, required: true },
        who: { type: Number, required: true },
      },
    ],
    buyTime: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const DiamondFund = mongoose.model<DiamondFundModel>(
  "DiamondFund",
  diamondSchema
);

export default DiamondFund;
