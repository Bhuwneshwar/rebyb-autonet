import express, { Response } from "express";
import UserAuthenticate from "../../middleware/UserAuthenticate";
import { IReq } from "../../types";
import User, { IUser } from "../../models/UsersSchema";
import History from "../../models/historySchema";
import { ObjectId } from "mongoose";

const history = async (req: IReq, res: Response) => {
  try {
    if (!req.rootUser || !req.userId)
      return res.send({ error: "You are not logged in" });
    // Function to retrieve history by userId
    const retrieveHistoryByUserId = async (userId: ObjectId) => {
      const histories = await History.find({
        $or: [
          { "incomes.referralAmount.userId": userId },
          { "incomes.topUpAmount.userId": userId },
          { "incomes.userAmount.userId": userId },
          { "expenses.recharge.userId": userId },
          { "expenses.userSend.userId": userId },
          { "expenses.withdrawOnBank.userId": userId },
          { "expenses.invest.userId": userId },
        ],
      });

      return histories;
    };

    // Example usage
    const userHistories = await retrieveHistoryByUserId(req.userId);
    console.log({ userHistories });

    // const expenses = user.expenses;
    // const incomes = user.incomes;
    // res.send({ success: true, expenses, incomes });
  } catch (error) {
    console.log(error);
    res.send({ error: "error in history" });
  }
};

const historyRoute = express.Router();
historyRoute.route("/history").get(UserAuthenticate, history);
export default historyRoute;