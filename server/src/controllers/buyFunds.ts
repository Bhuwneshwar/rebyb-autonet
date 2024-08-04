import GoldenFund from "../models/goldenSchema";
import DiamondFund from "../models/diamondSchema";
import goldenFund from "../controllers/goldenFund";
import diamondFund from "../controllers/diamondFund";
import { ObjectId } from "mongoose";
import { IReq } from "../types";
import { Response } from "express";
import { generateDueFunds } from "./SeparatesFunctions";

const buyFunds = async (
  req: IReq,
  res: Response,
  golden: number,
  diamond: number,
  userId: ObjectId
) => {
  try {
    const addGolden = async (userId: ObjectId): Promise<boolean> => {
      try {
        let lastGoldenFund = await GoldenFund.findOne().sort({
          $natural: -1,
        });

        const newGoldenFund = new GoldenFund({
          myId: lastGoldenFund ? lastGoldenFund.myId + 1 : 1,
          userId,
          fund: 0,
          reserveFund: 0,
        });

        const savedGoldenFund = await newGoldenFund.save();

        let remained = 390;
        let fund = 0;
        let remain = savedGoldenFund.myId % 2;
        let notEvenNum = savedGoldenFund.myId - remain;
        let oneByTwoNum = notEvenNum / 2;

        for (
          let num = 1;
          oneByTwoNum >= 1;
          remain = oneByTwoNum % 2,
            notEvenNum = oneByTwoNum - remain,
            oneByTwoNum = notEvenNum / 2,
            num++
        ) {
          switch (num) {
            case 1:
              remained -= fund = 250;
              break;
            case 2:
              remained -= fund = 125;
              break;
            default:
              if (oneByTwoNum === 3 || oneByTwoNum === 2) {
                remained -= fund = 10;
              } else if (oneByTwoNum === 1) {
                remained -= fund = 5;
              } else {
                fund = 0;
              }
          }

          if (fund > 0) {
            await goldenFund(oneByTwoNum, fund, savedGoldenFund.myId);
          }
        }

        if (remained > 0) {
          await GoldenFund.findByIdAndUpdate(
            savedGoldenFund._id,
            { reserveFund: remained },
            { new: true }
          );
        }

        return true;
      } catch (e) {
        console.log("Error in addGolden function:", e);
        return false;
      }
    };

    const addDiamond = async (userId: ObjectId): Promise<boolean> => {
      try {
        let lastDiamondFund = await DiamondFund.findOne().sort({
          $natural: -1,
        });

        const newDiamondFund = new DiamondFund({
          myId: lastDiamondFund ? lastDiamondFund.myId + 1 : 1,
          userId,
          fund: 0,
          reserveFund: 0,
        });

        const savedDiamondFund = await newDiamondFund.save();

        let remained = 780;
        let fund = 0;
        let remain = savedDiamondFund.myId % 2;
        let notEvenNum = savedDiamondFund.myId - remain;
        let oneByTwoNum = notEvenNum / 2;

        for (
          let num = 1;
          oneByTwoNum >= 1;
          remain = oneByTwoNum % 2,
            notEvenNum = oneByTwoNum - remain,
            oneByTwoNum = notEvenNum / 2,
            num++
        ) {
          switch (num) {
            case 1:
              remained -= fund = 500;
              break;
            case 2:
              remained -= fund = 250;
              break;
            default:
              if (oneByTwoNum === 3 || oneByTwoNum === 2) {
                remained -= fund = 20;
              } else if (oneByTwoNum === 1) {
                remained -= fund = 10;
              } else {
                fund = 0;
              }
          }

          if (fund > 0) {
            await diamondFund(oneByTwoNum, fund, savedDiamondFund.myId);
          }
        }

        if (remained > 0) {
          await DiamondFund.findByIdAndUpdate(
            savedDiamondFund._id,
            { reserveFund: remained },
            { new: true }
          );
        }

        return true;
      } catch (e) {
        console.log("Error in addDiamond function:", e);
        return false;
      }
    };

    for (let g = 0; g < golden; g++) {
      await addGolden(userId);
    }

    for (let d = 0; d < diamond; d++) {
      await addDiamond(userId);
    }

    if (req.rootUser) {
      const { arrDiamondFund, arrGoldenFund } = await generateDueFunds(
        req.rootUser
      );

      return {
        success: true,
        canBuyGolden: arrGoldenFund,
        canBuyDiamond: arrDiamondFund,
      };
    } else return { success: true };
  } catch (e) {
    console.log("Error in buyFunds function:", e);
    return { success: false };
  }
};

export default buyFunds;
