import { Request, Response } from "express";
import DiamondFund from "../models/diamondSchema";
import GoldenFund from "../models/goldenSchema";
import Message from "../models/messages";
import User, { IUser } from "../models/UsersSchema";

const dynamicFun = async (req: Request, res: Response) => {
  try {
    return "hi dynamic function ";
  } catch (e) {
    console.log("dynamicFun error :", e);
  }
};

const generateDueFunds = async (user: IUser) => {
  try {
    if (!user) return {};
    const { _id, RegisteredAt } = user;

    const regDate = new Date(RegisteredAt);
    const currentDate = new Date();
    const diffMilliseconds = currentDate.getTime() - regDate.getTime();
    const diffYears = diffMilliseconds / (1000 * 60 * 60 * 24 * 365);
    const diffYearsRounded = +diffYears.toFixed(2);

    // Convert the milliseconds to days
    const daysBetweenDates = Math.floor(
      diffMilliseconds / (1000 * 60 * 60 * 24)
    );

    let myGoldenFunds = await GoldenFund.find({ userId: _id });
    let myDiamondFunds = await DiamondFund.find({ userId: _id });

    console.log(daysBetweenDates);
    let gFund = 0;
    let dFund = 0;

    if (daysBetweenDates < 28) {
      gFund = myGoldenFunds ? 6 - myGoldenFunds.length : 6;
      dFund = myDiamondFunds ? 6 - myDiamondFunds.length : 6;
    } else {
      gFund = Math.ceil(daysBetweenDates / 28) * 6;
      gFund -= myGoldenFunds ? myGoldenFunds.length : 0;

      dFund = Math.ceil(daysBetweenDates / 28) * 6;
      dFund -= myDiamondFunds ? myDiamondFunds.length : 0;
    }

    const makeArray = (fund: number) => {
      let opt: number[] = [];
      for (let i = 1; i <= fund; i++) {
        opt.push(i);
      }
      return opt;
    };

    const arrGoldenFund = makeArray(gFund);
    const arrDiamondFund = makeArray(dFund);

    console.log("myDiamondFunds ", dFund);
    console.log("myGoldenFunds ", gFund);
    return { arrGoldenFund, arrDiamondFund, diffYearsRounded };
  } catch (e) {
    console.log("generateDueFunds error :", e);
    return { arrGoldenFund: [], arrDiamondFund: [], diffYearsRounded: 0 };
  }
};

export { generateDueFunds, dynamicFun };
