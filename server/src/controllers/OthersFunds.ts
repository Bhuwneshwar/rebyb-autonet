import { Request, Response } from "express";
import identification from "../middleware/identification";
import User from "../models/UsersSchema";
import Message from "../models/messages";
import DiamondFund from "../models/diamondSchema";
import GoldenFund from "../models/goldenSchema";
import { emitMessage } from "../middleware/Socket";
import instance from "../middleware/Razorpay";
import buyFunds from "../controllers/buyFunds";
import { account } from "../controllers/myAccount";
import { generateDueFunds } from "../controllers/SeparatesFunctions";
import dotenv from "dotenv";
import crypto from "crypto";
import { IReq } from "../types";
import { ObjectId } from "mongoose";

dotenv.config();

const checkOtherFunds = async (req: IReq, res: Response) => {
  try {
    let identifyMe: string = req.params.identifier;
    console.log(identifyMe);
    if (identifyMe == "null") return res.send("please Enter any identifier");
    if (!req.rootUser) return res.send("please login ");
    const identified = await identification(identifyMe, req.rootUser);
    console.log(identified.sameAccount);
    if (identified.sameAccount) return res.send("this is your identifier");
    if (!identified.type) return res.send("Invalid identifyMe");
    if (!identified.doc)
      return res.send("this " + identifyMe + "is not assigned");

    let otherUser = identified.doc;

    let myGoldenFunds = await GoldenFund.find({ userId: otherUser._id });
    let myDiamondFunds = await DiamondFund.find({ userId: otherUser._id });

    const regDate = new Date(otherUser.RegisteredAt);
    const currentDate = new Date();
    const diffMilliseconds = currentDate.getTime() - regDate.getTime();

    const daysBetweenDates = Math.floor(
      diffMilliseconds / (1000 * 60 * 60 * 24)
    );

    console.log(daysBetweenDates);
    let gFund = 0;
    let dFund = 0;
    if (daysBetweenDates < 28) {
      if (myGoldenFunds) {
        gFund = 6 - myGoldenFunds.length;
      } else gFund = 6;

      if (myDiamondFunds) {
        dFund = 6 - myDiamondFunds.length;
      } else dFund = 6;
    } else {
      gFund = Math.floor(daysBetweenDates / 28) * 3;
      if (myGoldenFunds) {
        gFund = 6 - myGoldenFunds.length + gFund;
      } else gFund = 6;

      dFund = Math.floor(daysBetweenDates / 28) * 3;
      if (myDiamondFunds) {
        dFund = 6 - myDiamondFunds.length + dFund;
      } else dFund = 6;
    }

    const makeArray = (fund: number) => {
      let opt: number[] = [];
      for (let i = 1; i <= fund; i++) {
        opt.push(i);
      }
      console.log(opt);
      return opt;
    };

    const arrGoldenFund = makeArray(gFund);
    const arrDiamondFund = makeArray(dFund);

    console.log(arrDiamondFund, arrGoldenFund);

    res.send({ canBuyGolden: arrGoldenFund, canBuyDiamond: arrDiamondFund });
  } catch (e) {
    console.log("checkOtherFunds error :", e);
  }
};

const addOtherFunds = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    const { fromAccount, MoneyHelp, identifyMe, messageId } = req.body;
    const selectedGolden = req.body.buyGoldenSelected;
    const selectedDiamond = req.body.buyDiamondSelected;

    if (+selectedGolden * 5 || +selectedGolden === 0) {
    } else return res.send("Invalid golden");
    if (+selectedDiamond * 5 || +selectedDiamond === 0) {
    } else return res.send("Invalid diamond");

    const amount = +selectedDiamond * 1000 + +selectedGolden * 500;
    if (amount < 1) return res.send("please select diamond or golden");
    console.log(amount);

    if (+selectedDiamond + +selectedGolden > 0) {
    } else return res.send("Invalid diamond or golden");

    if (!req.rootUser) return res.send("please login ");

    const identified = await identification(identifyMe, req.rootUser);

    let otherUser = identified.doc;

    if (identified.sameAccount) return res.send("this is same Account");

    if (!otherUser) return res.send("invalid identifyMe");

    const { arrDiamondFund, arrGoldenFund } = await generateDueFunds(otherUser);

    if (arrDiamondFund && arrGoldenFund) {
    } else return res.send({ error: "something is wrong" });

    if (arrGoldenFund.length < selectedGolden)
      return res.send(
        `you can buy Golden Fund less than of ${arrGoldenFund} or ${arrGoldenFund}`
      );

    if (arrDiamondFund.length < selectedDiamond)
      return res.send(
        `you can buy Diamond Fund less than of ${arrGoldenFund} or ${arrGoldenFund}`
      );

    switch (fromAccount) {
      case "account":
        req.session.otherDiamond = +selectedDiamond;
        req.session.otherGolden = +selectedGolden;
        req.session.otherDoc = otherUser._id;
        const options = {
          amount: +amount * 100, // amount in the smallest currency unit
          currency: "INR",
          // receipt: "order_rcptid_11",
        };
        const order = await instance.orders.create(options);
        console.log(order);
        return res.send({
          success: true,
          FunName: "addOtherFunds",
          order,
          key: process.env.RAZORPAY_API_KEY,
          name: req.rootUser.name,
          email: req.rootUser.email || "krabi6563@gmail.com",
          contact: req.rootUser.contact,
        });

        break;
      case "balance":
        let moneyHelp = 0;
        if (messageId) {
          const isMsg = await Message.findOne({
            _id: messageId,
            sender: otherUser._id,
          });
          console.log("isMsg", isMsg);
          if (!isMsg) return res.send("can't match message proof.");

          try {
            const objMsg = JSON.parse(isMsg.message);
            console.log(objMsg);
            moneyHelp = +objMsg.PaidMoney;
          } catch (e) {
            return res.send("this is simple message. ");
          }
        }
        const netAmount = amount - moneyHelp;

        if (req.rootUser.Balance < netAmount || req.rootUser.Balance < 1)
          return res.send(`Low Balance from ${netAmount}`);

        let referralMoney = +selectedDiamond * 20 + +selectedGolden * 10;

        const buyOthers = await User.findByIdAndUpdate(
          req.rootUser._id,
          {
            $push: {
              "expenses.userSend": {
                netAmount,
                from: "balance",
                to: identified.doc?._id,
              },
              "incomes.referralAmount": {
                amount: referralMoney,
                from: identified.doc?._id,
              },
            },
            $inc: {
              Balance: referralMoney - netAmount,
            },
          },
          { new: true }
        );
        if (!buyOthers) return res.send("Something went wrong!");

        const sentHelpMoney = await User.findByIdAndUpdate(
          identified.doc?._id,
          {
            $push: {
              "expenses.userSend": {
                moneyHelp,
                from: "balance",
                to: req.rootUser._id,
              },
            },
            $inc: {
              Balance: -moneyHelp,
            },
          },
          { new: true }
        );
        if (!sentHelpMoney) return res.send("Something went wrong2!");
        if (!identified.doc) return res.send("Something went wrong3!");

        let fundAdded = await buyFunds(
          +selectedGolden,
          +selectedDiamond,
          identified.doc?._id,
          "balance_order_id",
          "balance_signature",
          "balance_payment_id"
        );

        const updatedUser = await User.findById(req.rootUser._id);
        if (updatedUser) {
          return res.send({
            success: true,
            fundAdded,
            updated: await account(updatedUser),
          });
        }

        break;

      default:
        return res.send({ error: "invalid fromAccount", ...req.body });
    }

    res.send(req.body);
    console.log(req.body);
  } catch (e) {
    console.log("addOtherFunds error :", e);
  }
};

const addOthersPaymentVerification = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      FunName,
    } = req.body;
    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET as string)
      .update(body.toString())
      .digest("hex");

    console.log("sig received ", razorpay_signature);
    console.log("sig generated ", expectedSignature);

    const signatureIsValid = expectedSignature === razorpay_signature;
    if (signatureIsValid) {
      let fundAdded = await buyFunds(
        req.session.otherGolden,
        req.session.otherDiamond,
        req.session.otherDoc,
        razorpay_order_id,
        razorpay_signature,
        razorpay_payment_id
      );
      if (fundAdded) {
        let referralMoney =
          +req.session.otherDiamond * 20 + +req.session.otherGolden * 10;
        let amount =
          +req.session.otherDiamond * 1000 + +req.session.otherGolden * 500;

        const buyOthers = await User.findByIdAndUpdate(
          req.rootUser?._id,
          {
            $push: {
              "expenses.userSend": {
                amount,
                from: "bank",
                to: req.session.otherDoc,
              },
              "incomes.referralAmount": {
                amount: referralMoney,
                from: req.session.otherDoc,
              },
            },
            $inc: {
              Balance: referralMoney,
            },
          },
          { new: true }
        );
        if (!buyOthers) return res.send("Something went wrong!");
      }
      const updatedUser = await User.findById(req.userId);
      if (updatedUser) {
        return res.send({
          success: true,
          fundAdded,
          updated: await account(updatedUser),
        });
      }
    } else return res.send({ message: "payment faild" });
  } catch (e) {
    console.log(e);
  }
};

const sendMessage = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    const { recieverId } = req.body;
    const userMessage = req.body.Message;
    if (!req.rootUser) return res.send({ error: "Please login first" });
    const identified = await identification(recieverId, req.rootUser);

    if (!identified.doc) return res.send("invalid user refference");
    if (identified.sameAccount) return res.send("this is same account ");

    const trimedMessage = userMessage.toString().trim();
    console.log(trimedMessage);

    // Create a new instance of the Message model using the new message object
    const messageInstance = new Message({
      message: trimedMessage,
      sender: req.rootUser._id,
      receiver: identified.doc._id,
    });

    // Save the message to the database
    const saved = await messageInstance.save();
    if (saved) {
      const notify = emitMessage(String(identified.doc._id), {
        sender: req.rootUser.name,
        message: trimedMessage,
      });
      if (notify) {
        res.send({ message: "message sent", status: "notified" });
      } else res.send({ message: "message sent", status: "db" });
    } else {
      res.send("message not sent");
    }
  } catch (e) {
    console.log("sendMessage error :", e);
  }
};

const getMessages = async (req: IReq, res: Response) => {
  try {
    const { referCode } = req.params;
    if (referCode) {
      console.log(referCode);
      if (!req.rootUser) return res.send({ error: "Please login first" });

      const identified = await identification(referCode, req.rootUser);

      if (!identified.doc) return res.send("invalid user refference");
      if (identified.sameAccount) return res.send("this is same account ");

      const myMessages = await Message.find({
        $or: [
          { sender: identified.doc._id, receiver: req.rootUser._id },
          { receiver: identified.doc._id, sender: req.rootUser._id },
        ],
      });
      if (!myMessages) return res.send("no messages");

      console.log(myMessages);

      const mySms = myMessages
        .filter((doc) => doc.sender === req.rootUser?._id)
        .map((doc) => {
          return {
            id: doc._id,
            message: doc.message,
            time: doc.timestamp,
            align: "right",
          };
        });

      const senderSms = myMessages
        .filter((doc) => doc.sender === identified.doc?._id)
        .map((doc) => {
          return {
            id: doc._id,
            message: doc.message,
            time: doc.timestamp,
            align: "left",
          };
        });

      const { arrGoldenFund, arrDiamondFund } = await generateDueFunds(
        identified.doc
      );

      return res.send({
        mySms,
        senderSms,
        info: {
          name: identified.doc.name,
          goldenFunds: arrGoldenFund,
          diamondFunds: arrDiamondFund,
        },
      });
    }

    const myMessages = await Message.find({
      $or: [{ sender: req.rootUser?._id }, { receiver: req.rootUser?._id }],
    });
    if (!myMessages) return res.send("no messages");

    console.log(myMessages);

    const allMessages = myMessages.filter(
      (doc, index, self) =>
        index ===
        self.findIndex(
          (o) => o.receiver === doc.receiver && o.sender === doc.sender
        )
    );
    const ids: ObjectId[] = [];
    allMessages.map((doc) => {
      ids.push(doc.sender);
      ids.push(doc.receiver);
      return true;
    });
    const users = await User.find({ _id: { $in: ids } });

    const names = users.map((doc) => {
      return { name: doc.name, referCode: doc.referCode };
    });

    //const myMessages = await Message.find({});

    return res.send({ names });
  } catch (e) {
    console.log("getMessages error :", e);
  }
};

const join = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);
    const { user } = req.body;
    if (!req.rootUser) return res.send({ error: "Please login first" });
    const identified = await identification(user, req.rootUser);

    if (identified.sameAccount) return res.send("this is same account ");
    if (identified.doc) {
      return res.send({ referCode: identified.doc.referCode });
    } else return res.send("invalid user ");
  } catch (e) {
    console.log("join error :", e);
  }
};

export {
  checkOtherFunds,
  addOtherFunds,
  sendMessage,
  getMessages,
  join,
  addOthersPaymentVerification,
};
