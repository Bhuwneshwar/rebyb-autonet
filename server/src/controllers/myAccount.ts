import { Request, Response } from "express";
import DiamondFund from "../models/diamondSchema";
import GoldenFund from "../models/goldenSchema";
import Message from "../models/messages";
import User, { IUser } from "../models/UsersSchema";
import { generateDueFunds } from "../controllers/SeparatesFunctions";
import { IReq } from "../types";

const myAccount = async (req: IReq, res: Response) => {
  try {
    if (!req.rootUser) return res.send({ error: "You are not logged in" });
    const {
      _id,
      name,
      age,
      gender,
      contact,
      email,
      transactionMethod,
      upi,
      ifsc,
      bank,
      password,
      RegisteredAt,
      Balance,
      updatedDate,
      incomes,
      expenses,
      rechargeNum1,
      rechargeNum2,
      rechargeNum3,
      referCode,
      coverImg,
      profileImg,
      autoRecharge,
      autoWithdraw,
      NextInvest,
      Priority,
      role,
      withdrawPerc,
    } = req.rootUser;
    console.log({ ...req.rootUser });

    let myGoldenFunds = await GoldenFund.find({ userId: _id });
    let myDiamondFunds = await DiamondFund.find({ userId: _id });

    let goldenFunds = myGoldenFunds.map((doc) => ({
      fund: doc.fund,
      funding: doc.fundReturnHistory,
      buyTime: doc.buyTime,
    }));

    let diamondFunds = myDiamondFunds.map((doc) => ({
      fund: doc.fund,
      funding: doc.fundReturnHistory,
      buyTime: doc.buyTime,
    }));

    const { arrDiamondFund, arrGoldenFund, diffYearsRounded } =
      await generateDueFunds(req.rootUser);

    const lastM = await Message.findOne({
      $or: [{ sender: req.rootUser._id }, { receiver: req.rootUser._id }],
    }).sort({ $natural: -1 });

    let lastMesssge;
    let recev;
    if (lastM) {
      if (lastM.sender === req.rootUser._id) {
        recev = await User.findById(lastM.receiver);
      } else {
        recev = await User.findById(lastM.sender);
      }
      lastMesssge = {
        referCode: recev?.referCode,
        message: lastM.message,
        time: lastM.timestamp,
        name: recev?.name,
      };
    } else {
      lastMesssge = "no messages";
    }

    let response = {
      _id,
      name,
      age: +age + (diffYearsRounded || 0),
      gender,
      contact,
      email,
      transactionMethod,
      upi,
      ifsc,
      bank,
      password: !!password,
      RegisteredAt,
      Balance,
      updatedDate,
      incomes,
      expenses,
      diamondFunds,
      goldenFunds,
      referCode,
      canBuyGolden: arrGoldenFund,
      canBuyDiamond: arrDiamondFund,
      lastMesssge,
      coverImg,
      profileImg,
      rechargeNum1,
      rechargeNum2,
      rechargeNum3,
      autoRecharge,
      autoWithdraw,
      NextInvest,
      Priority,
      role,
      withdrawPerc,
    };

    res.send({ success: true, user: response });
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
};

const account = async (updatedDoc: IUser) => {
  try {
    const {
      _id,
      name,
      age,
      gender,
      contact,
      email,
      transactionMethod,
      upi,
      ifsc,
      bank,
      password,
      RegisteredAt,
      Balance,
      updatedDate,
      incomes,
      expenses,
      rechargeNum1,
      rechargeNum2,
      rechargeNum3,
      coverImg,
      profileImg,
      autoRecharge,
      autoWithdraw,
      NextInvest,
      Priority,
      referCode,
      role,
      withdrawPerc,
    } = updatedDoc;

    let myGoldenFunds = await GoldenFund.find({ userId: _id });
    let myDiamondFunds = await DiamondFund.find({ userId: _id });

    let goldenFunds = myGoldenFunds.map((doc) => ({
      fund: doc.fund,
      funding: doc.fundReturnHistory,
      buyTime: doc.buyTime,
    }));

    let diamondFunds = myDiamondFunds.map((doc) => ({
      fund: doc.fund,
      funding: doc.fundReturnHistory,
      buyTime: doc.buyTime,
    }));

    const { arrDiamondFund, arrGoldenFund, diffYearsRounded } =
      await generateDueFunds(updatedDoc);

    let rechNums = [];
    if (rechargeNum1?.number) rechNums.push(rechargeNum1);
    if (rechargeNum2?.number) rechNums.push(rechargeNum2);
    if (rechargeNum3?.number) rechNums.push(rechargeNum3);

    const lastM = await Message.findOne({
      $or: [{ sender: _id }, { receiver: _id }],
    }).sort({ $natural: -1 });

    let lastMesssge;
    let recev;
    if (lastM) {
      if (lastM.sender == _id) {
        recev = await User.findById(lastM.receiver);
      } else {
        recev = await User.findById(lastM.sender);
      }
      lastMesssge = {
        referCode: recev?.referCode,
        message: lastM.message,
        time: lastM.timestamp,
        name: recev?.name,
      };
    } else {
      lastMesssge = "no messages";
    }

    let response = {
      name,
      age: +age + (diffYearsRounded || 0),
      gender,
      contact,
      email,
      transactionMethod,
      upi,
      ifsc,
      bank,
      password: !!password,
      RegisteredAt,
      Balance,
      updatedDate,
      incomes,
      expenses,
      rechNums,
      diamondFunds,
      goldenFunds,
      canBuyGolden: arrGoldenFund,
      canBuyDiamond: arrDiamondFund,
      lastMesssge,
      coverImg,
      profileImg,
      autoRecharge,
      autoWithdraw,
      NextInvest,
      Priority,
      referCode,
      role,
      withdrawPerc,
    };

    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { myAccount, account };
