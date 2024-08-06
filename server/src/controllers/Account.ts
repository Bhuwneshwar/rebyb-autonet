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
import Temporary from "../models/Temporary";
import { ObjectId } from "mongoose";
import Transaction from "../models/historySchema";
import AdminHome from "../models/AdminHome";
import materials from "../utils/Materials.json";
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

const topUpComplete = async (
  req: Request,
  res: Response,
  amount: number,
  userId: ObjectId
) => {
  try {
    const updatedDoc = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { Balance: amount },
      },
      { new: true }
    );

    const trans = await Transaction.create({
      category: "income",
      subcategory: "topUp",
      amount,
      userId,
      date: new Date(),
      from: "account",
    });
    console.log({ trans });

    res.send({ success: true, Balance: updatedDoc?.Balance, type: "top-up" });
    console.log("Top-up successful");
  } catch (error) {
    console.log("at topUpComplete function", error);
    res.send({ error: "Something went wrong!" });
  }
};

const topUp = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    if (!req.rootUser) {
      return res.send({ error: "please login" });
    }
    const { amount }: { amount: number } = req.body;

    if (typeof amount !== "number")
      return res.json({ error: "Amount should be type number" });

    if (amount > 0) {
      // Proceed with top-up logic
    } else {
      return res.json({ error: "Amount should be grater then 0" });
    }

    // req.session.topup = amount;
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      // receipt: "order_rcptid_11",
    };
    const order = await instance.orders.create(options);
    console.log({ order });

    const temp = await Temporary.create({
      id: order.id,
      FunName: "top-up",
      amount,
      UserId: req.userId,
      referralCode: req.rootUser.referCode,
    });

    console.log({ temp });
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
    res.send({ error: "Something went wrong" });
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
    if (!req.rootUser) return res.send({ error: "Please login first" });

    console.log(req.body);

    const {
      amount,
      transactionMethod,
    }: { amount: number; transactionMethod: string } = req.body;

    if (typeof amount !== "number")
      return res.json({ error: "Amount must be a number" });

    if (amount < 1)
      return res.json({ error: "Amount should be greater than zero" });

    if (req.rootUser.Balance < amount)
      return res.json({ error: "Low balance to " + amount });

    if (req.rootUser.transactionMethod === "none")
      return res.json({
        error:
          "Your transaction method is none. Please update your transaction method",
      });

    if (typeof transactionMethod !== "string")
      return res.json({ error: "invalid transaction method!" });

    if (transactionMethod === "")
      return res.json({ error: "Transaction method is required!" });
    let adminWork;
    switch (transactionMethod) {
      case "both":
        adminWork = await AdminHome.create({
          Amount: amount,
          bank: req.rootUser.bank,
          ifsc: req.rootUser.ifsc,
          UserId: req.userId,
          Type: "withdraw",
          transactionMethod,
          upi: req.rootUser.upi,
        });
        break;
      case "upi":
        adminWork = await AdminHome.create({
          Amount: amount,
          UserId: req.userId,
          Type: "withdraw",
          transactionMethod,
          upi: req.rootUser.upi,
        });
        break;
      case "bank":
        adminWork = await AdminHome.create({
          Amount: amount,
          bank: req.rootUser.bank,
          ifsc: req.rootUser.ifsc,
          UserId: req.userId,
          Type: "withdraw",
          transactionMethod,
        });
        break;
      default:
        return res.json({ error: "Transaction method is not specified!" });

        break;
    }
    console.log({ adminWork });
    // to do admin work is due to transaction
    res.send({ success: true });
    // const withdrawal = await User.findByIdAndUpdate(
    //   req.rootUser._id,
    //   {
    //     $push: {
    //       "expenses.withdrawOnBank": {
    //         amount: realAmount,
    //         to: "bank",
    //       },
    //     },
    //     $inc: {
    //       Balance: -amount,
    //     },
    //   },
    //   { new: true }
    // );

    // if (withdrawal) {
    //   return res.json({
    //     message: "Withdrawal successful",
    //     updated: await account(withdrawal),
    //   });
    // } else {
    //   return res.json("Withdrawal failed");
    // }
  } catch (e) {
    console.error(e);
    res.send({ error: "Something went wrong" });
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

    if (typeof contact !== "string")
      return res.send({ error: "Recharge Number must be a string" });
    if (typeof rechargePlan !== "string")
      return res.send({ error: "Recharge Plan must be a string" });

    const { rechargeNum1, rechargeNum2, rechargeNum3, Balance } = req.rootUser;

    const selectPlans = (opera?: string) => {
      if (opera === "jio") {
        return materials.RechargePlans.jio || [];
      }
      if (opera === "airtel") {
        return materials.RechargePlans.airtel || [];
      }
      if (opera === "bsnl") {
        return materials.RechargePlans.bsnl || [];
      }
      if (opera === "mtnl delhi") {
        return materials.RechargePlans.mtnlDelhi || [];
      }
      if (opera === "mtnl mumbai") {
        return materials.RechargePlans.mtnlMumbai || [];
      }
      if (opera === "vi") {
        return materials.RechargePlans.vi || [];
      }
      return [];
    };
    let rechargeInfo;
    if (contact === rechargeNum1?.number) {
      const plans = selectPlans(rechargeNum1.operator);
      let matchedPlan = false;
      plans.forEach((plan) => {
        if (!matchedPlan) {
          matchedPlan = JSON.stringify(plan) === rechargePlan;
        }
      });
      if (!matchedPlan) return res.send({ error: "Please select a plan" });
      rechargeInfo = rechargeNum1;
    } else if (contact === rechargeNum2?.number) {
      const plans = selectPlans(rechargeNum2.operator);
      let matchedPlan = false;
      plans.forEach((plan) => {
        if (!matchedPlan) {
          matchedPlan = JSON.stringify(plan) === rechargePlan;
        }
      });
      if (!matchedPlan) return res.send({ error: "Please select a plan" });
      rechargeInfo = rechargeNum2;
    } else if (contact === rechargeNum3?.number) {
      const plans = selectPlans(rechargeNum3.operator);
      let matchedPlan = false;
      plans.forEach((plan) => {
        if (!matchedPlan) {
          matchedPlan = JSON.stringify(plan) === rechargePlan;
        }
      });
      if (!matchedPlan) return res.send({ error: "Please select a plan" });
      rechargeInfo = rechargeNum3;
    } else return res.send({ error: "Invalid Recharge Number" });

    const objPlan = JSON.parse(rechargePlan);
    console.log({ objPlan });

    if (Balance < objPlan.price)
      return res.send({ error: "low Balance to " + objPlan.price });

    const newRecharge = await AdminHome.create({
      UserId: req.userId,
      number: contact,
      state: rechargeInfo.state,
      operator: rechargeInfo.operator,
      Amount: objPlan.price,
      plan: objPlan.price,
      Type: "Recharge",
    });

    console.log({ newRecharge });
    if (newRecharge) {
      return res.send({
        success: true,
        message: "Recharge request saved successfully",
      });
    } else {
      res.send({ error: "recharge request failed" });
    }

    // if (+rechargePlan * 5) {
    // } else return res.send({ error: "Invalid rechargePlan" });

    // let rechNums: string[] = [];
    // if (rechargeNum1) rechNums.push(rechargeNum1.number);
    // if (rechargeNum2) rechNums.push(rechargeNum2.number);
    // if (rechargeNum3) rechNums.push(rechargeNum3.number);

    // console.log(rechNums);
    // if (!rechNums.includes(contact))
    //   return res.send("this number is not available in your recharge service");

    // const newRecharge = await User.findByIdAndUpdate(
    //   req.rootUser._id,
    //   {
    //     $push: {
    //       "expenses.recharge": {
    //         contact,
    //         amount: rechargePlan,
    //         validity: 28,
    //       },
    //     },
    //     $inc: {
    //       Balance: -rechargePlan,
    //     },
    //   },
    //   { new: true }
    // );

    // console.log(newRecharge);
    // if (newRecharge) {
    //   return res.send({
    //     message: "recharge successful on " + contact,
    //     updated: await account(newRecharge),
    //   });
    // } else {
    //   res.send("recharge failed");
    // }
    res.send({ success: true });
  } catch (e) {
    console.log(e);
    res.send({ error: "Something went wrong" });
  }
};

//invest

const verifyBalanceAccessPin = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);

    if (!req.rootUser) return res.send({ error: "Please first login" });
    const { BalancePin } = req.body;

    if (typeof BalancePin !== "string")
      return res.send({ error: " balance pin must be a string" });
    if (BalancePin === "")
      return res.send({ error: " balance pin is required" });
    if (BalancePin.length !== 6)
      return res.send({
        error: " balance pin should 6 digits!",
      });
    if (!/^[\d]{6}$/.test(BalancePin))
      return res.send({
        error: " balance pin allow only number keys!",
      });

    if (!req.rootUser.BalanceAccessPin)
      return res.send({ error: `Balance PIN is not set.` });

    const { ExpiredAt, attempt, tempDataId } =
      req.rootUser.BalanceAccessPinWork;

    const valid = new Date(ExpiredAt) > new Date();
    if (!valid) {
      return res.send({
        error: "Time out please try again",
      });
    }
    if (attempt < 10) {
      const IsMatch = await bcrypt.compare(
        BalancePin,
        req.rootUser.BalanceAccessPin
      );

      if (!IsMatch) {
        await User.findByIdAndUpdate(req.userId, {
          $set: {
            "BalanceAccessPinWork.attempt": attempt + 1,
          },
        });
        return res.json({ error: "Cannot match Balance PIN" });
      }

      const tempData = await Temporary.findById(tempDataId);
      if (!tempData)
        return res
          .status(201)
          .send({ success: true, message: "Already processed" });

      console.log("Temporary data found:", tempData);

      const { FunName } = tempData;
      await tempData.deleteOne();

      if (FunName === "buyFunds") {
        const amount = tempData.golden * 500 + tempData.diamond * 1000;
        if (amount > req.rootUser.Balance)
          return res.send({ error: `Balance is not sufficient.` });

        await User.findByIdAndUpdate(req.userId, {
          $inc: {
            Balance: -amount,
          },
        });

        const invested = await buyFunds(
          req,
          res,
          tempData.golden,
          tempData.diamond,
          tempData.UserId
        );
        if (invested.success) {
          const addedExpensesInvest = await Transaction.create({
            golden: tempData.golden,
            diamond: tempData.diamond,
            amount: tempData.amount,
            from: "balance",
            date: new Date(),
            category: "expense",
            subcategory: "invest",
            userId: tempData.UserId,
          });
          console.log({ addedExpensesInvest });
          // const addedExpensesInvest = await User.findByIdAndUpdate(
          //   req.userId,
          //   {
          //     $push: {
          //       "expenses.invest": {
          //         golden: tempData.golden,
          //         diamond: tempData.diamond,
          //         amount,
          //         from: "balance",
          //         date: Date(),
          //       },
          //     },
          //   },
          //   { new: true }
          // );
          // console.log({ addedExpensesInvest });

          res.send({
            ...invested,
            type: "invested-using-balance",
            Balance: req.rootUser.Balance - amount,
          });
        } else {
          await User.findByIdAndUpdate(req.userId, {
            $inc: {
              Balance: amount,
            },
          });
          return res.send({
            error: "Failed to buy funds",
          });
        }
      }
    } else
      return res.send({
        error: `cross the attempted limit. try again after 2 minutes`,
      });
  } catch (err) {
    console.log(err);
    res.send({ error: "Something went wrong" });
  }
};
const invest = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);

    if (!req.rootUser) return res.send({ error: "Please first login" });

    const { golden, diamond, from, BalancePin } = req.body;

    if (typeof golden !== "number" || !Number.isInteger(golden))
      return res.send({ error: "Invalid golden fund Count" });

    if (typeof diamond !== "number" || !Number.isInteger(diamond))
      return res.send({ error: "Invalid diamond fund Count" });

    if (typeof from !== "string")
      return res.send({ error: "from should be string " });

    if (golden + diamond < 1)
      return res.send({ error: "at least choose one fund" });

    const { arrDiamondFund, arrGoldenFund } = await generateDueFunds(
      req.rootUser
    );

    if (arrGoldenFund.length < golden)
      return res.send({
        error: `you can buy only ${arrGoldenFund.length} GoldenFund now.`,
      });
    if (arrDiamondFund.length < diamond)
      return res.send({
        error: `you can buy only ${arrDiamondFund.length} DiamondFund now.`,
      });

    switch (from) {
      case "balance":
        {
          if (!req.rootUser.BalanceAccessPin)
            return res.send({ error: `Balance PIN is not set.` });

          const amount = golden * 500 + diamond * 1000;
          if (amount > req.rootUser.Balance)
            return res.send({ error: `Balance is not sufficient.` });

          const temp = await Temporary.create({
            id: Math.random() * 100 + Date.now(),
            FunName: "buyFunds",
            diamond,
            golden,
            amount,
            UserId: req.userId,
            referralCode: req.rootUser.referCode,
          });

          console.log({ temp });
          const updatedBalanceWork = await User.findByIdAndUpdate(req.userId, {
            $set: {
              BalanceAccessPinWork: {
                // amount,
                // reason: "buyFunds",
                ExpiredAt: new Date(Date.now() + 1000 * 60 * 2),
                attempt: 1,
                tempDataId: temp._id,
              },
            },
          });
          console.log({ updatedBalanceWork });

          return res.send({
            requestBalancePin: true,
            amount,
            message: "Please enter balance access PIN",
          });
        }

        break;
      case "account":
        const amount = golden * 500 + diamond * 1000;
        const options = {
          amount: amount * 100, // amount in the smallest currency unit
          currency: "INR",
        };

        const order = await instance.orders.create(options);
        console.log({ order });

        const temp = await Temporary.create({
          id: order.id,
          FunName: "buyFunds",
          diamond,
          golden,
          amount,
          UserId: req.userId,
          referralCode: req.rootUser.referCode,
        });

        console.log({ temp });

        return res.send({
          success: true,
          order,
          key: process.env.RAZORPAY_API_KEY,
          name: req.rootUser.name,
          email: req.rootUser.email || "krabi6563@gmail.com",
          contact: req.rootUser.contact,
        });

      default:
        return res.send({ error: "from should be balance/account " });
    }

    // req.session.newBuyFunds = {
    //   diamond: diamond,
    //   golden: golden,
    // };
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Server Error" });
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
        req,
        res,
        req.session.newBuyFunds.golden,
        req.session.newBuyFunds.diamond,
        req.userId
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
  sendMoney,
  withdraw,
  accountPaymentVerification,
  getDueFunds,
  recharge,
  //
  topUpComplete,
  topUp,
  invest,
  verifyBalanceAccessPin,
  //
  setReferCode,
  genReferCode,
  addFundsPaymentVerification,
  accountPaymentVerificationSendMoney,
  buyAutoNet,
};
