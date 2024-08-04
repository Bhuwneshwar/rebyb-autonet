import { Response } from "express";
import jwt from "jsonwebtoken";
import addFund from "../controllers/buyFunds";
import User from "../models/UsersSchema";
import { TemporaryModel } from "../models/Temporary";
import { IReq } from "../types";
import TempUser from "../models/TempUserSchema";
import History from "../models/historySchema";

require("dotenv").config();

const register = async (
  req: IReq,
  res: Response,
  { diamond, golden, UserId, referralCode }: TemporaryModel
) => {
  try {
    let accessToken: string | undefined;
    if (!req.rootUser) {
      accessToken = jwt.sign(
        { userId: UserId, time: Date.now() },
        process.env.JWT_SECRET || ""
      );
    }

    const tempData = await TempUser.findById(UserId);
    if (!tempData) return res.send({ error: "Temp User not found" });
    console.log({ tempData });

    const newUserInstance = new User({
      name: tempData.name,
      age: tempData.age,
      gender: tempData.gender,
      contact: tempData.contact,
      email: tempData.email,
      referCode: tempData.referCode,
      transactionMethod: tempData.transactionMethod,
      upi: tempData.upi,
      ifsc: tempData.ifsc,
      bank: tempData.bank,
      autoWithdraw: tempData.autoWithdraw,
      autoRecharge: tempData.autoRecharge,
      NextInvest: tempData.NextInvest,
      withdrawPerc: tempData.withdrawPerc,
      userType: "permanent",
      Priority: tempData.Priority,
      rechargeNum1: tempData.rechargeNum1,
      rechargeNum2: tempData.rechargeNum2,
      rechargeNum3: tempData.rechargeNum3,
      accessToken,
      role: "user",
    });
    const newUser = await newUserInstance.save();
    const fundAdded = await addFund(req, res, golden, diamond, newUser._id);

    if (fundAdded.success && newUser) {
      let referralMoney;
      console.log("referId : ", referralCode);

      if (referralCode) {
        referralMoney = diamond * 20 + golden * 10;

        const referralUpdate = await User.findOneAndUpdate(
          { referCode: referralCode },
          {
            $inc: {
              Balance: referralMoney,
            },
          },
          { new: true }
        );
        console.log({ referralUpdate });

        const savedHistory = await History.create({
          incomes: {
            referralAmount: [
              {
                id: newUser._id,
                diamond,
                golden,
                amount: referralMoney,
                date: new Date(),
                name: newUser.name,
                userId: referralUpdate?._id,
              },
            ],
          },
          // other fields initialization
        });
      }

      if (accessToken) {
        res.cookie("rebybfund", accessToken).send({
          redirect: "/dashboard",
          message: "User Registration successful",
          username: newUser.referCode,
          success: true,
        });
      } else {
        res.send({
          redirect: "/dashboard",
          message: "User Registration successful",
          username: newUser.referCode,
          success: true,
        });
      }
      await TempUser.findByIdAndDelete(UserId);
    } else {
      return res.send({ message: "payment failed" });
    }
  } catch (e) {
    console.log("register error :", e);
    // require("../ErrorsStore").errorsStore(e, "at register ");
  }
};

export default register;
