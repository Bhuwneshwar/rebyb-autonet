import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface MessageModel extends Document {
  message: string;
  timestamp: Date;
  sender: ObjectId;
  receiver: ObjectId;
  // receiverAccess?: boolean; // Uncomment if needed
  // senderAccess?: boolean;   // Uncomment if needed
}

const messagesSchema: Schema<MessageModel> = new Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  // receiverAccess: { type: Boolean, default: true }, // Uncomment if needed
  // senderAccess: { type: Boolean, default: true },   // Uncomment if needed
});

const Message = mongoose.model<MessageModel>("Message", messagesSchema);

export default Message;
