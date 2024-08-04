import { Request, Response } from "express";
import dotenv from "dotenv";
import material from "../utils/Materials.json";
import validation from "../middleware/validation";
import instance from "../middleware/Razorpay";
import Temporary from "../models/Temporary";
import User, { IUser } from "../models/UsersSchema";
import { ObjectId } from "mongoose";
import TempUser from "../models/TempUserSchema";

dotenv.config();

const generateReferCode = (length: number): string => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let referCode = "";

  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    referCode += characters.charAt(randomIndex);
  }
  return referCode;
};

const makeArray = (fund: number) => {
  let opt: number[] = [];
  for (let i = 1; i <= fund; i++) {
    opt.push(i);
  }
  return opt;
};

export const registration = async (req: Request, res: Response) => {
  let userExist = true;
  let referCode: string | undefined;

  while (userExist) {
    referCode = generateReferCode(20);
    console.log(referCode);
    const exist = await User.findOne({ referCode });
    if (exist) {
      userExist = true;
    } else {
      userExist = false;
    }
  }

  res.send({
    operators: material.operators,
    states: material.states,
    transactionMethods: material.transactionMethods,
    RechargePlans: material.RechargePlans,
    diamond: makeArray(6),
    golden: makeArray(6),
    UniqueReferCode: referCode,
    success: true,
  });
};

interface IReq extends Request {
  rootUser?: IUser;
  userId?: ObjectId;
}
export const registrationPost = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    console.log("session: data", { ...req.session });

    const validate = await validation(req);
    if (!validate?.status) {
      return res.send({ error: validate.message, success: false });
    }
    const Ok = validate.data;
    if (!Ok) return res.send({ error: "invalid details" });

    // // console.log("OK data", { Ok });
    // return res.send({ Ok });

    const amount = Ok.diamond * 1000 + Ok.golden * 500;

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    console.log({ order });

    const alreadyTempUser = await TempUser.findOne({
      userType: "temporary",
      $or: [
        { contact: Ok.phoneNumber },
        { email: Ok.email },
        { referCode: Ok.setRefer },
      ],
    });

    const newDetails = {
      name: Ok.name,
      age: Ok.age,
      gender: Ok.gender,
      contact: Ok.phoneNumber,
      email: Ok.email,
      referCode: Ok.setRefer,
      transactionMethod: Ok.transactionMethod,
      upi: Ok.upi,
      ifsc: Ok.ifsc,
      bank: Ok.bank,
      autoWithdraw: Ok.autoWithdraw,
      autoRecharge: Ok.autoRecharge,
      NextInvest: Ok.NextInvest,
      withdrawPerc: Ok.withdraw_perc,
      userType: "temporary",

      Priority: {
        no_1: Ok.priority[0],
        no_2: Ok.priority[1],
        no_3: Ok.priority[2],
      },

      rechargeNum1: {
        operator: Ok.opera1,
        state: Ok.state1,
        number: Ok.rechNum1,
        validity: Ok.ExistingValidityOne,
        plan: Ok.SelectedPlan1,
      },
      rechargeNum2: {
        operator: Ok.opera2,
        state: Ok.state2,
        number: Ok.rechNum2,
        validity: Ok.ExistingValiditytwo,
        plan: Ok.SelectedPlan2,
      },
      rechargeNum3: {
        operator: Ok.opera3,
        state: Ok.state3,
        number: Ok.rechNum3,
        validity: Ok.ExistingValiditythree,
        plan: Ok.SelectedPlan3,
      },
    };

    let tempuser;
    if (alreadyTempUser) {
      tempuser = await TempUser.findByIdAndUpdate(
        alreadyTempUser._id,
        { ...newDetails },
        { new: true }
      );
      console.log("alreadyTempUser");
    } else {
      const newUser = new TempUser(newDetails);
      console.log("newtempUser");
      tempuser = await newUser.save();
    }
    console.log({ tempuser });
    if (!tempuser)
      return res.status(404).send({ error: "User details was wrong." });

    const { diamond, golden } = Ok;
    const refer = Ok?.refer || req?.rootUser?.referCode;

    const temp = await Temporary.create({
      id: order.id,
      FunName: "register",
      diamond,
      golden,
      amount,
      UserId: tempuser._id,
      referralCode: refer,
    });

    console.log({ temp });

    req.session.phoneVerified = undefined;
    req.session.phoneVerifiedTime = undefined;
    req.session.emailVerified = undefined;
    req.session.emailVerifiedTime = undefined;

    res.send({
      success: true,
      order,
      key: process.env.RAZORPAY_API_KEY,
      name: Ok.name,
      email: Ok.email || "krabi6563@gmail.com",
      contact: Ok.phoneNumber,
    });
  } catch (e) {
    console.log(e);
    res.status(502).send(e);
  }
};

export const checkNumber = async (req: Request, res: Response) => {
  try {
    const { mob } = req.query;
    console.log(mob);

    const exist = await User.findOne({
      $or: [
        { "rechargeNum1.number": mob },
        { "rechargeNum2.number": mob },
        { "rechargeNum3.number": mob },
      ],
    });

    console.log({ exist });
    if (exist) return res.send({ error: "this number already added!" });
    else return res.send({ success: true });
    // res.send("this number already added on " + nums + " accounts");
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Server Error" });
  }
};

export default { registration, registrationPost, checkNumber };
