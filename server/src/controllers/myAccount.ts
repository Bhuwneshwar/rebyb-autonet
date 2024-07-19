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

    const generateExpendHistory = (id: number, fund: number) => {
      const oneByTwoNum = (num: number) => {
        const level1 = num % 2;
        const level2 = num - level1;
        const level3 = level2 / 2;
        return level3;
      };
      const level1 = oneByTwoNum(id);
      const level2 = oneByTwoNum(level1);

      return {
        level1: { fund: 250 * fund, id: level1 },
        level2: { fund: 125 * fund, id: level2 },
        refferal: 10 * fund,
        service: 115 * fund,
      };
    };
    console.log(generateExpendHistory(400, 2));

    const generateUpcomingHistory = (id: number, fund: number) => {
      // logic to generate history returns
      const level1 = id * 2;
      const level2 = id * 2 + 1;
      const level3 = level1 * 2;
      const level4 = level1 * 2 + 1;
      const level5 = level2 * 2;
      const level6 = level2 * 2 + 1;
      const arr = [
        { id: level1, amount: 250 * fund, date: "??-??-????", upcoming: true },
        { id: level2, amount: 250 * fund, date: "??-??-????", upcoming: true },
        { id: level3, amount: 125 * fund, date: "??-??-????", upcoming: true },
        { id: level4, amount: 125 * fund, date: "??-??-????", upcoming: true },
        { id: level5, amount: 125 * fund, date: "??-??-????", upcoming: true },
        { id: level6, amount: 125 * fund, date: "??-??-????", upcoming: true },
      ];
      console.log({ arr });
      return arr;
    };
    generateUpcomingHistory(876, 2);

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
