import express, { Response } from "express";
import UserAuthenticate from "../../middleware/UserAuthenticate";
import { IReq } from "../../types";
import GoldenFund from "../../models/goldenSchema";
import DiamondFund from "../../models/diamondSchema";

const dashboard = async (req: IReq, res: Response) => {
  try {
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
    // console.log(generateExpendHistory(400, 2));

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
      ] as {
        id: number;
        amount: number;
        date: Date | string;
        upcoming: boolean;
      }[];
      console.log({ arr });
      return arr;
    };

    if (!req.rootUser) return res.send({ error: "You are not logged in" });
    const { _id } = req.rootUser;

    let myGoldenFunds = await GoldenFund.find({ userId: _id });
    let myDiamondFunds = await DiamondFund.find({ userId: _id });

    let goldenFunds = myGoldenFunds.map((doc) => ({
      fund: doc.fund,
      funding: doc.fundReturnHistory,
      buyTime: doc.createdAt,
      id: doc.myId,
    }));

    let diamondFunds = myDiamondFunds.map((doc) => ({
      fund: doc.fund,
      funding: doc.fundReturnHistory,
      buyTime: doc.createdAt,
      id: doc.myId,
    }));

    const diamondFunds2 = diamondFunds.map((diamond) => {
      const fundingHistory = generateUpcomingHistory(diamond.id, 2);
      fundingHistory[0] = diamond.funding[0]
        ? {
            amount: diamond.funding[0].many,
            date: diamond.funding[0].when,
            id: diamond.funding[0].who,
            upcoming: false,
          }
        : fundingHistory[0];

      fundingHistory[1] = diamond.funding[1]
        ? {
            amount: diamond.funding[1].many,
            date: diamond.funding[1].when,
            id: diamond.funding[1].who,
            upcoming: false,
          }
        : fundingHistory[1];

      fundingHistory[2] = diamond.funding[2]
        ? {
            amount: diamond.funding[2].many,
            date: diamond.funding[2].when,
            id: diamond.funding[2].who,
            upcoming: false,
          }
        : fundingHistory[2];

      fundingHistory[3] = diamond.funding[3]
        ? {
            amount: diamond.funding[3].many,
            date: diamond.funding[3].when,
            id: diamond.funding[3].who,
            upcoming: false,
          }
        : fundingHistory[3];

      fundingHistory[4] = diamond.funding[4]
        ? {
            amount: diamond.funding[4].many,
            date: diamond.funding[4].when,
            id: diamond.funding[4].who,
            upcoming: false,
          }
        : fundingHistory[4];

      fundingHistory[5] = diamond.funding[5]
        ? {
            amount: diamond.funding[5].many,
            date: diamond.funding[5].when,
            id: diamond.funding[5].who,
            upcoming: false,
          }
        : fundingHistory[5];

      const expendHistory = generateExpendHistory(diamond.id, 2);
      return { ...diamond, funding: fundingHistory, expendHistory };
    });

    const goldenFunds2 = goldenFunds.map((golden) => {
      const fundingHistory = generateUpcomingHistory(golden.id, 1);
      fundingHistory[0] = golden.funding[0]
        ? {
            amount: golden.funding[0].many,
            date: golden.funding[0].when,
            id: golden.funding[0].who,
            upcoming: false,
          }
        : fundingHistory[0];

      fundingHistory[1] = golden.funding[1]
        ? {
            amount: golden.funding[1].many,
            date: golden.funding[1].when,
            id: golden.funding[1].who,
            upcoming: false,
          }
        : fundingHistory[1];

      fundingHistory[2] = golden.funding[2]
        ? {
            amount: golden.funding[2].many,
            date: golden.funding[2].when,
            id: golden.funding[2].who,
            upcoming: false,
          }
        : fundingHistory[2];

      fundingHistory[3] = golden.funding[3]
        ? {
            amount: golden.funding[3].many,
            date: golden.funding[3].when,
            id: golden.funding[3].who,
            upcoming: false,
          }
        : fundingHistory[3];

      fundingHistory[4] = golden.funding[4]
        ? {
            amount: golden.funding[4].many,
            date: golden.funding[4].when,
            id: golden.funding[4].who,
            upcoming: false,
          }
        : fundingHistory[4];

      fundingHistory[5] = golden.funding[5]
        ? {
            amount: golden.funding[5].many,
            date: golden.funding[5].when,
            id: golden.funding[5].who,
            upcoming: false,
          }
        : fundingHistory[5];

      const expendHistory = generateExpendHistory(golden.id, 1);

      return { ...golden, funding: fundingHistory, expendHistory };
    });

    res.send({
      success: true,
      diamondFunds: diamondFunds2,
      goldenFunds: goldenFunds2,
    });
  } catch (error) {
    console.log(error);
    res.send({ error: "error in dashboard" });
  }
};

const dashboardRoute = express.Router();
dashboardRoute.route("/dashboard").get(UserAuthenticate, dashboard);
export default dashboardRoute;
