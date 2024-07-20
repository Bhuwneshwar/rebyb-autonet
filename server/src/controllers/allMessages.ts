import { Response } from "express";
import Message from "../models/messages";
import { IReq } from "../types";
import User from "../models/UsersSchema";

const allMessages = async (req: IReq, res: Response) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }],
    });
    if (!messages)
      return res
        .status(404)
        .json({ success: false, message: "No messages found" });

    const us = messages.map(async (message) => {
      if (message.sender === req.userId) {
        let sender = await User.findById(message.receiver);
        let node = {
          referCode: sender?.referCode,
          profileImg: sender?.profileImg,
          name: sender?.name,
          message: message.message,
          timestamp: message.timestamp,
          type: "sender",
          // time:message.createdAt,
        };

        return {
          _id: message._id,
          sender: message.sender,
          receiver: message.receiver,
        };
      } else {
        return {
          _id: message._id,
          sender: message.receiver,
          receiver: message.sender,
        };
      }
    });

    res.json({ success: true, messages });
    console.log({ messages });
  } catch (err) {
    console.log(err);
  }
};

export default allMessages;
