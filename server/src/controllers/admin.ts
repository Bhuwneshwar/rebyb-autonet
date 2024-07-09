import { Request, Response } from "express";
import User, { IUser } from "../models/UsersSchema";
import AdminHome from "../models/AdminHome";
import GoldenFund from "../models/goldenSchema";
import DiamondFund from "../models/diamondSchema";
import { getDays } from "../controllers/moneyManager";

export const admin = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    const diamond = await DiamondFund.find();
    const golden = await GoldenFund.find();
    res.send({ users, diamond, golden });
  } catch (e) {
    console.error("Error in admin function:", e);
    res.status(500).send("Internal Server Error");
  }
};

export const adminWork = async (req: Request, res: Response) => {
  try {
    const works = await AdminHome.find();
    res.send(works);
  } catch (e) {
    console.error("Error in adminWork function:", e);
    res.status(500).send("Internal Server Error");
  }
};

export const rechargeComplete = async (req: Request, res: Response) => {
  try {
    const { id, number, plan } = req.body;
    const plans = [
      { Rs: 299, validity: 28 },
      { Rs: 199, validity: 28 },
      { Rs: 149, validity: 20 },
    ];
    const match = plans.find((obj) => obj.Rs === +plan);
    if (!match) return res.status(400).send("Invalid plan Rs.");

    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found.");

    const getFutureDate = (pastDate: Date) => {
      const days = getDays(pastDate);
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + match.validity - days);
      return currentDate;
    };

    let update;
    if (user.rechargeNum1?.number === number) {
      update = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            "rechargeNum1.validity": match.validity,
            "rechargeNum1.rechargedAt": Date.now(),
          },
          $push: {
            "expenses.recharge": {
              contact: number,
              validity: match.validity,
              amount: match.Rs,
            },
          },
        },
        { new: true }
      );
    } else if (user.rechargeNum2?.number === number) {
      update = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            "rechargeNum2.validity": match.validity,
            "rechargeNum2.rechargedAt": Date.now(),
          },
          $push: {
            "expenses.recharge": {
              contact: number,
              validity: match.validity,
              amount: match.Rs,
            },
          },
        },
        { new: true }
      );
    } else if (user.rechargeNum3?.number === number) {
      update = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            "rechargeNum3.validity": match.validity,
            "rechargeNum3.rechargedAt": Date.now(),
          },
          $push: {
            "expenses.recharge": {
              contact: number,
              validity: match.validity,
              amount: match.Rs,
            },
          },
        },
        { new: true }
      );
    }

    if (update) {
      await AdminHome.deleteOne({ number });
      const works = await AdminHome.find();
      res.send(works);
    } else {
      res.status(500).send("Failed to update user.");
    }
  } catch (e) {
    console.error("Error in rechargeComplete function:", e);
    res.status(500).send("Internal Server Error");
  }
};

export const withdrawComplete = async (req: Request, res: Response) => {
  try {
    const { id, Amount, Method } = req.body;
    const updated = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          "expenses.withdrawOnBank": {
            to: Method,
            amount: Amount,
          },
        },
      },
      { new: true }
    );
    if (updated) {
      await AdminHome.deleteOne({
        UserId: id,
        Amount,
        transactionMethod: Method,
      });
      res.send({ success: true, updated });
    } else {
      res.status(404).send({ success: false });
    }
  } catch (e) {
    console.error("Error in withdrawComplete function:", e);
    res.status(500).send("Internal Server Error");
  }
};
