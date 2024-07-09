import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface TemporaryModel extends Document {
  id: string;
  FunName: string;
  Data?: string;
  diamond: number;
  golden: number;
  UserId: ObjectId;
  referCode?: string;
}

const TemporarySchema: Schema<TemporaryModel> = new Schema({
  id: { type: String, required: true, unique: true },
  FunName: { type: String, required: true },
  Data: String,
  diamond: { type: Number, required: true },
  golden: { type: Number, required: true },
  UserId: { type: String, required: true },
  referCode: String,
});

const Temporary = mongoose.model<TemporaryModel>("Temporary", TemporarySchema);

export default Temporary;
