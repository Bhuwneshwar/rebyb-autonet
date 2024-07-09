import { Request, Response } from "express";
import dotenv from "dotenv";
import material from "../utils/Materials.json";
import validation from "../middleware/validation";
import instance from "../middleware/Razorpay";
import Temporary from "../models/Temporary";
import User, { IUser } from "../models/UsersSchema";
import { ObjectId } from "mongoose";

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

    const validate = await validation(req);
    if (!validate.status) {
      return res.send({ message: validate.message, success: false });
    }

    const Ok = validate.data;
    console.log("OK data", Ok);

    const amount = Ok.diamond * 1000 + Ok.golden * 500;

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    console.log(order);

    const alreadyTempUser = await User.findOne({
      userType: "temporary",
      $or: [
        { contact: Ok.contact },
        { email: Ok.email },
        { referCode: Ok.setRefer },
      ],
    });

    const newDetails = {
      name: Ok.name,
      age: Ok.age,
      gender: Ok.gender,
      contact: Ok.contact,
      email: Ok.email,
      referCode: Ok.setRefer,
      transactionMethod: Ok.transactionMethod,
      upi: Ok.upi,
      ifsc: Ok.ifsc,
      bank: Ok.bank,
      autoWithdraw: Ok.autoWithdraw,
      autoRecharge: Ok.autoRecharge,
      NextInvest: Ok.NextInvest,
      withdrawPerc: Ok.WithdrawPerc,
      userType: "temporary",

      Priority: {
        no_1: Ok.PriorityNo_1,
        no_2: Ok.PriorityNo_2,
        no_3: Ok.PriorityNo_3,
      },
      expenses: {
        recharge: {
          amount: 0,
        },
        userSend: {
          amount: 0,
        },
        withdrawOnBank: {
          amount: 0,
        },
      },
      incomes: {
        referralAmount: {
          amount: 0,
        },
        topupAmount: {
          amount: 0,
        },
        userAmount: {
          amount: 0,
        },
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
      tempuser = await User.findByIdAndUpdate(
        alreadyTempUser._id,
        { ...newDetails },
        { new: true }
      );
      console.log("alreadyTempUser");
    } else {
      const newUser = new User(newDetails);
      console.log("newUser");
      tempuser = await newUser.save();
    }
    console.log({ tempuser });
    if (!tempuser)
      return res.status(404).send({ error: "User details was wrong." });

    const refer = Ok?.referId || req?.rootUser?._id;
    let referralMoney = 0;
    console.log("referId : ", refer);

    const { diamond, golden, setRefer } = Ok;
    if (refer) {
      referralMoney = diamond * 20 + golden * 10;

      const referralUpdate = await User.findByIdAndUpdate(
        refer,
        {
          $push: {
            "incomes.referralAmount": {
              amount: referralMoney,
              from: tempuser._id,
            },
          },
          $inc: {
            Balance: referralMoney,
          },
        },
        { new: true }
      );
      console.log({ referralUpdate });
    }

    const temp = await Temporary.create({
      id: order.id,
      FunName: "register",
      diamond,
      golden,
      UserId: tempuser._id,
      referCode: setRefer,
    });

    console.log(temp);

    res.send({
      success: true,
      order,
      key: process.env.RAZORPAY_API_KEY,
      name: Ok.name,
      email: Ok.emailVerified || "krabi6563@gmail.com",
      contact: Ok.phoneVerified,
    });

    req.session.phoneVerified = 0;
    req.session.phoneVerifiedTime = 0;
    req.session.emailVerified = "";
    req.session.emailVerifiedTime = 0;
  } catch (e) {
    console.log(e);
  }
};

export const checkNumber = async (req: Request, res: Response) => {
  try {
    const { mob } = req.query;
    console.log(mob);

    const nums = await User.countDocuments({
      $or: [
        { "rechargeNum1.number": mob },
        { "rechargeNum2.number": mob },
        { "rechargeNum3.number": mob },
      ],
    });

    console.log(nums);
    res.send("this number already added on " + nums + " accounts");
  } catch (e) {
    console.log(e);
  }
};

export default { registration, registrationPost, checkNumber };
