import { ObjectId } from "mongoose";
import { IUser } from "../models/UsersSchema";
import { Request } from "express";

export interface IReq extends Request {
  token?: string;
  rootUser?: IUser;
  userId?: ObjectId;
}

interface InewBuyFunds {
  diamond: number;
  golden: number;
}

export interface IToken {
  userId: ObjectId;
  time: number;
}

declare module "express-session" {
  interface Session {
    userId?: ObjectId;
    phoneVerified?: number;
    phoneVerifiedTime?: number;
    emailVerified?: string;
    emailVerifiedTime?: number;
    time: number;
    otp: string;
    count: number;
    contact: number;
    email: string;
    timeEmail: number;
    otpEmail: string;
    countEmail: number;
    attempt: number;
    superValidity: number;
    sendMoney: number;
    otherDocSendMoney?: ObjectId;
    topup: number;
    newBuyFunds: InewBuyFunds;
    otherDiamond: number;
    otherGolden: number;
    otherDoc: ObjectId;
  }
}
