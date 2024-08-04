import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface MessageModel extends Document {
  message: string;
  sender: ObjectId;
  receiver: ObjectId;
  receiverAccess: boolean; // Uncomment if needed
  senderAccess: boolean; // Uncomment if needed
  unread: boolean; // Uncomment if needed
  createdAt: Date;
  updatedAt: Date;
}

const messagesSchema: Schema<MessageModel> = new Schema(
  {
    message: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    receiverAccess: { type: Boolean, default: true }, // Uncomment if needed
    senderAccess: { type: Boolean, default: true }, // Uncomment if needed
    unread: { type: Boolean, default: true }, // Uncomment if needed
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<MessageModel>("Message", messagesSchema);

export default Message;
