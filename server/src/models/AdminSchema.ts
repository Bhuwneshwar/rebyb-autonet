import mongoose, { Schema, Document } from "mongoose";

export interface AdminModel extends Document {
  CountUp: number;
  Multiple: number;
  EveryThreeH: number;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema: Schema<AdminModel> = new Schema(
  {
    CountUp: { type: Number, default: 0 },
    Multiple: { type: Number, default: 0 },
    EveryThreeH: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model<AdminModel>("Admin", adminSchema);

export default Admin;
