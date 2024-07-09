import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { account } from "../controllers/myAccount";
import { moneyManager } from "../controllers/moneyManager";
import buyFunds from "../controllers/buyFunds";
import identification from "../middleware/identification";
import User, { IUser, Recharge } from "../models/UsersSchema";
import instance from "../middleware/Razorpay";
import { generateDueFunds } from "../controllers/SeparatesFunctions";
import dotenv from "dotenv";
import { IReq } from "../types";

dotenv.config();

const buyAutoNet = async (req: IReq, res: Response) => {
  // try {
  //   console.log(req.body);
  //   const { identifyId, amount, nav } = req.body;
  //   if (identifyId.length === 0 || amount.length === 0 || nav.length === 0)
  //     return res.json("Please fill all the details");
  //   if (typeof +amount !== "number") return res.json("Amount must be a number");
  //   if (!req.rootUser) return res.send({ error: "please first login" });
  //   const identified = await identification(identifyId, req.rootUser);
  //   let otherUser = identified.doc;
  //   if (!identified.type) return res.json("Invalid identifyId");
  //   if (identified.sameAccount) return res.json("This is the same account");
  //   if (!otherUser) return res.json("User not found!");
  //   const fundPurchase = await buyFunds(
  //     req.rootUser._id,
  //     amount,
  //     identifyId,
  //     nav,
  //     golden: number, diamond: number, userId: ObjectId, order: string, signature: string, payment: string
  //   );
  //   if (fundPurchase) {
  //     return res.json({
  //       message: "Funds purchased successfully",
  //       updated: await account(fundPurchase),
  //     });
  //   } else {
  //     return res.json("Funds purchase failed");
  //   }
  // } catch (e) {
  //   console.error(e);
  // }
};

const changePassword = async (req: IReq, res: Response) => {
  try {
    console.log({ ...req.body });
    const { oldPassword, newPassword } = req.body;
    const db_password = req.rootUser?.password;

    if (!db_password)
      return res.status(400).json({
        error: "You should set your password at '/api/set-password'",
      });

    if (
      newPassword &&
      typeof newPassword === "string" &&
      newPassword.length >= 4
    ) {
      // Proceed with password change logic
    } else {
      return res.status(400).json({
        error: "Your new password must be at least 4 characters long",
      });
    }

    if (
      oldPassword &&
      typeof oldPassword === "string" &&
      oldPassword.length >= 4
    ) {
      // Proceed with password change logic
    } else {
      return res.status(400).json({
        error: "Your old password must be at least 4 characters long",
      });
    }

    const IsMatch = await bcrypt.compare(oldPassword, db_password);

    if (!IsMatch)
      return res.status(400).json({ error: "Cannot match password" });

    const hashed_password = await bcrypt.hash(newPassword, 12);
    console.log({ hashed_password });

    const setPass = await User.findByIdAndUpdate(
      req.userId,
      { password: hashed_password },
      { new: true }
    );
    console.log({ setPass });
    return res.json({
      success: true,
      message: "Your password has been changed",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const setPassword = async (req: IReq, res: Response) => {
  try {
    console.log({ ...req.body });
    const { newPassword } = req.body;
    const db_password = req.rootUser?.password;

    if (db_password)
      return res.status(400).json({
        error: "You should change your password at '/api/change-password'",
      });

    if (
      newPassword &&
      typeof newPassword === "string" &&
      newPassword.length >= 4
    ) {
      // Proceed with set password logic
    } else {
      return res.status(400).json({
        error: "Your new password must be at least 4 characters long",
      });
    }

    const hashed_password = await bcrypt.hash(newPassword, 12);
    console.log({ hashed_password });

    const setPass = await User.findByIdAndUpdate(
      req.userId,
      { password: hashed_password },
      { new: true }
    );
    console.log({ setPass });
    res.json({
      success: true,
      newPassword: true,
      message: "Your password has been saved",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const sendMoney = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    const { kitna, kisko, kahase } = req.body;

    if (kitna.length === 0 || kisko.length === 0)
      return res.status(400).json("Please Enter valid details");

    if (typeof +kitna !== "number")
      return res.status(400).json("'kitna' expected integer value");

    if (!req.rootUser) return res.send({ error: "Please login first" });

    const identified = await identification(kisko, req.rootUser);
    let otherUser = identified.doc;

    if (!identified.type) return res.status(400).json("Invalid kisko");
    if (identified.sameAccount)
      return res.status(400).json("This is the same Account");

    if (!otherUser) return res.status(400).json("User not found!");

    switch (kahase) {
      case "account":
        const amount = +kitna;
        req.session.sendMoney = amount;
        req.session.otherDocSendMoney = identified.doc?._id;

        const options = {
          amount: +amount * 100, // amount in the smallest currency unit
          currency: "INR",
          // receipt: "order_rcptid_11",
        };
        const order = await instance.orders.create(options);
        console.log(order);
        return res.json({
          payNow: true,
          order,
          key: process.env.RAZORPAY_API_KEY,
          name: req.rootUser.name,
          email: req.rootUser.email || "krabi6563@gmail.com",
          contact: req.rootUser.contact,
        });

      case "balance":
        if (req.rootUser.Balance < kitna)
          return res.json("Money is low from " + kitna);

        const expense = await User.findByIdAndUpdate(
          req.rootUser._id,
          {
            $push: {
              "expenses.userSend": {
                amount: kitna,
                from: "balance",
                to: otherUser._id,
              },
            },
            $inc: {
              Balance: -kitna,
            },
          },
          { new: true }
        );

        console.log(expense);
        const income = await User.findByIdAndUpdate(
          otherUser._id,
          {
            $push: {
              "incomes.userAmount": {
                amount: kitna,
                from: req.rootUser._id,
              },
            },
            $inc: {
              Balance: kitna,
            },
          },
          { new: true }
        );

        console.log(expense);
        if (expense && income) {
          return res.json({
            redirect: "/myaccount",
            message: "Money credited on " + kisko,
            updated: await account(expense),
          });
        } else return res.json("Money transfer failed");

      default:
        return res.json("Invalid kahase");
    }
  } catch (e) {
    console.error(e);
  }
};

const topUp = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    const { amount }: { amount: number } = req.body;

    if (typeof amount !== "number") return res.json("Enter Amount");

    if (amount > 0) {
      // Proceed with top-up logic
    } else {
      return res.json("Invalid amount");
    }

    req.session.topup = amount;
    const options = {
      amount: +amount * 100, // amount in the smallest currency unit
      currency: "INR",
      // receipt: "order_rcptid_11",
    };
    const order = await instance.orders.create(options);
    console.log(order);
    return res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_API_KEY,
      name: req.rootUser?.name,
      email: req.rootUser?.email || "krabi6563@gmail.com",
      contact: req.rootUser?.contact,
    });
  } catch (e) {
    console.error(e);
  }
};

const accountPaymentVerification = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET as string)
      .update(body.toString())
      .digest("hex");

    console.log("sig received ", razorpay_signature);
    console.log("sig generated ", expectedSignature);

    const signatureIsValid = expectedSignature === razorpay_signature;
    if (signatureIsValid) {
      const TopUpAdded = await User.findByIdAndUpdate(
        req.rootUser?._id,
        {
          $push: {
            "incomes.topupAmount": {
              amount: req.session.topup,
              from: "bank",
            },
          },
          $inc: {
            Balance: req.session.topup,
          },
        },
        { new: true }
      );
      if (TopUpAdded) {
        res.json({
          message: "TopUp Debited",
          updated: await account(TopUpAdded),
        });

        if (req.userId) {
          moneyManager(req.userId, res);
        }
      } else {
        return res.json("TopUp failed");
      }
    } else return res.json({ message: "Payment failed" });
  } catch (e) {
    console.error(e);
  }
};

const withdraw = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    const { amount }: { amount: number } = req.body;

    if (typeof amount !== "number") return res.json("Enter Amount");

    if (amount > 0) {
      // Proceed with withdrawal logic
    } else {
      return res.json("Invalid amount");
    }

    let realAmount = +amount;
    if (!req.rootUser) return res.send({ error: "Please login first" });

    if (req.rootUser.Balance < amount)
      return res.json("Low balance from " + +amount);

    const withdrawal = await User.findByIdAndUpdate(
      req.rootUser._id,
      {
        $push: {
          "expenses.withdrawOnBank": {
            amount: realAmount,
            to: "bank",
          },
        },
        $inc: {
          Balance: -amount,
        },
      },
      { new: true }
    );

    if (withdrawal) {
      return res.json({
        message: "Withdrawal successful",
        updated: await account(withdrawal),
      });
    } else {
      return res.json("Withdrawal failed");
    }
  } catch (e) {
    console.error(e);
  }
};

const getDueFunds = async (req: IReq, res: Response) => {
  try {
    if (!req.rootUser) return res.send({ error: "Not logged in" });
    const dueFunds = await generateDueFunds(req.rootUser);
    return res.json({
      dueFunds,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

const recharge = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    const { contact, rechargePlan } = req.body;
    if (!req.rootUser) return res.send({ error: "please login first" });
    const { rechargeNum1, rechargeNum2, rechargeNum3, Balance } = req.rootUser;

    if (+rechargePlan * 5) {
    } else return res.send("Invalid rechargePlan");

    if (Balance < rechargePlan)
      return res.send("low Balance for " + rechargePlan);

    let rechNums: string[] = [];
    if (rechargeNum1) rechNums.push(rechargeNum1.number);
    if (rechargeNum2) rechNums.push(rechargeNum2.number);
    if (rechargeNum3) rechNums.push(rechargeNum3.number);

    console.log(rechNums);
    if (!rechNums.includes(contact))
      return res.send("this number is not available in your recharge service");

    const newRecharge = await User.findByIdAndUpdate(
      req.rootUser._id,
      {
        $push: {
          "expenses.recharge": {
            contact,
            amount: rechargePlan,
            validity: 28,
          },
        },
        $inc: {
          Balance: -rechargePlan,
        },
      },
      { new: true }
    );

    console.log(newRecharge);
    if (newRecharge) {
      return res.send({
        message: "recharge successful on " + contact,
        updated: await account(newRecharge),
      });
    } else {
      res.send("recharge failed");
    }
  } catch (e) {
    console.log(e);
  }
};

//invest

const invest = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);

    const { golden, diamond } = req.body;

    if (+golden * 5 || +golden === 0) {
    } else return res.send("Invalid golden");
    if (+diamond * 5 || +diamond === 0) {
    } else return res.send("Invalid diamond");

    if (+diamond + +golden > 0) {
    } else return res.send("Invalid diamond or golden");
    if (!req.rootUser) return res.send({ error: "please login first" });

    const { arrDiamondFund, arrGoldenFund } = await generateDueFunds(
      req.rootUser
    );
    if (arrGoldenFund && arrDiamondFund) {
    } else return res.send({ error: "something went wrong" });

    if (arrGoldenFund.length < golden)
      return res.send(`you can buy only ${arrGoldenFund} GoldenFund now.`);
    if (arrDiamondFund.length < +diamond)
      return res.send(`you can buy only ${arrDiamondFund} DiamondFund now.`);

    req.session.newBuyFunds = {
      diamond: diamond,
      golden: golden,
    };

    const amount = +golden * 500 + +diamond * 1000;
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    console.log(order);

    return res.send({
      success: true,
      order,
      key: process.env.RAZORPAY_API_KEY,
      name: req.rootUser.name,
      email: req.rootUser.email || "krabi6563@gmail.com",
      contact: req.rootUser.contact,
    });
  } catch (e) {
    console.log(e);
  }
};

const addFundsPaymentVerification = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET as string)
      .update(body.toString())
      .digest("hex");

    console.log("sig received ", razorpay_signature);
    console.log("sig generated ", expectedSignature);

    const signatureIsValid = expectedSignature === razorpay_signature;
    if (signatureIsValid && req.userId) {
      const result = await buyFunds(
        req.session.newBuyFunds.golden,
        req.session.newBuyFunds.diamond,
        req.userId,
        razorpay_order_id,
        razorpay_signature,
        razorpay_payment_id
      );
    } else return res.send({ message: "payment failed" });
  } catch (e) {
    console.log("addFundsPaymentVerification error :", e);
  }
};

const accountPaymentVerificationSendMoney = async (
  req: IReq,
  res: Response
) => {
  try {
    console.log(req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET as string)
      .update(body.toString())
      .digest("hex");

    console.log("sig received ", razorpay_signature);
    console.log("sig generated ", expectedSignature);

    const signatureIsValid = expectedSignature === razorpay_signature;
    if (signatureIsValid) {
      const amount = req.session.sendMoney;
      const receiptId = req.session.otherDocSendMoney;

      const expense = await User.findByIdAndUpdate(
        req.rootUser?._id,
        {
          $push: {
            "expenses.userSend": {
              amount,
              from: "bank",
              to: receiptId,
            },
          },
        },
        { new: true }
      );

      console.log(expense);
      const income = await User.findByIdAndUpdate(
        receiptId,
        {
          $push: {
            "incomes.userAmount": {
              amount,
              from: req.rootUser?._id,
            },
          },
          $inc: {
            Balance: amount,
          },
        },
        { new: true }
      );

      console.log(expense);
      if (expense && income) {
        return res.send({
          redirect: "/myaccount",
          message: amount + " Rs. credited on " + income.name,
          updated: await account(expense),
        });
      } else return res.send({ message: "Something went wrong!" });
    } else return res.send({ message: "payment failed" });
  } catch (e) {
    console.log("addFundsPaymentVerification error :", e);
  }
};

const setReferCode = async (req: IReq, res: Response) => {
  try {
    console.log({ ...req.body });

    const { newReferCode } = req.body;

    if (!newReferCode) return res.send({ error: "please make a newReferCode" });
    if (!req.rootUser) return res.send({ error: "please login first" });

    const identified = await identification(
      newReferCode.toString().trim(),
      req.rootUser
    );

    if (identified.referCode) {
      if (identified.sameAccount)
        return res.send({
          error: "Oho old ReferCode please make a new ReferCode",
        });

      const updateResult = await User.findByIdAndUpdate(
        req.rootUser._id,
        { $set: { referCode: newReferCode } },
        { new: true }
      );

      console.log("Update result:", updateResult);

      return res.send({
        success: true,
        newReferCode: updateResult?.referCode,
        redirect: "/myaccount",
        message: "New ReferCode set successfully",
      });
    } else return res.send({ error: "Invalid newReferCode! " });
  } catch (e) {
    console.log("setnewReferCode error :", e);
    return res.send({ error: "Something went wrong!" });
  }
};

const genReferCode = async (req: Request, res: Response) => {
  try {
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

    // Example usage
    let userExist = true;
    let referCode: string = "";
    while (userExist) {
      referCode = generateReferCode(20);
      console.log(referCode);

      const yes = await User.findOne({ referCode });
      if (yes) {
        userExist = true;
      } else {
        userExist = false;
      }
    }

    res.send({ generatedReferCode: referCode, success: true });
  } catch (e) {
    console.log("genReferCode error :", e);
    res.send({ error: "Something went wrong!" });
  }
};

export {
  changePassword,
  sendMoney,
  topUp,
  withdraw,
  setPassword,
  accountPaymentVerification,
  getDueFunds,
  recharge,
  invest,
  setReferCode,
  genReferCode,
  addFundsPaymentVerification,
  accountPaymentVerificationSendMoney,
  buyAutoNet,
};
