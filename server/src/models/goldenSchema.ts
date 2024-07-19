import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface GoldenFundModel extends Document {
  _id: ObjectId;
  myId: number;
  userId: string;
  fund: number;
  reserveFund: number;
  orderId: string;
  paymentId: string;
  signature: string;
  fundReturnHistory: Array<{ many: number; when: Date; who: string }>;
  buyTime: Date;
}

const goldenSchema: Schema<GoldenFundModel> = new Schema(
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
        many: { type: Number, required: true },
        when: { type: Date, required: true },
        who: { type: String, required: true },
      },
    ],
    buyTime: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const GoldenFund = mongoose.model<GoldenFundModel>("GoldenFund", goldenSchema);

export default GoldenFund;
