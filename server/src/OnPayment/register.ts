import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import addFund from "../controllers/buyFunds";
import User, { IUser } from "../models/UsersSchema";
import { TemporaryModel } from "../models/Temporary";
import { IReq } from "../types";

require("dotenv").config();

const register = async (
  req: IReq,
  res: Response,
  { diamond, golden, UserId, referCode }: TemporaryModel,
  order_id: string,
  payment_id: string,
  signature: string
) => {
  try {
    let accessToken: string | undefined;
    if (!req.rootUser) {
      accessToken = jwt.sign(
        { referCode, time: Date.now() },
        process.env.JWT_SECRET || ""
      );
    }

    const fundAdded = await addFund(
      golden,
      diamond,
      UserId,
      order_id,
      signature,
      payment_id
    );

    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      UserId,
      {
        userType: "permanent",
        accessToken,
      },
      { new: true }
    );

    if (fundAdded.success && updatedUser) {
      if (accessToken) {
        res.cookie("rebybfund", accessToken).send({
          redirect: "/myaccount",
          message: "User Registration successful",
          updatedUser,
        });
      } else {
        res.send({
          redirect: "/myaccount",
          message: "User Registration successful",
          updatedUser,
        });
      }
    } else {
      return res.send({ message: "payment failed" });
    }
  } catch (e) {
    console.log("register error :", e);
    // require("../ErrorsStore").errorsStore(e, "at register ");
  }
};

export default register;
