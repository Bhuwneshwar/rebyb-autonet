import User from "../../models/UsersSchema";
import goldenFund from "../goldenFund";
import diamondFund from "../diamondFund";
import AutoRegistration from "./AutoRegistration";
import GoldenFund from "../../models/goldenSchema";
import DiamondFund from "../../models/diamondSchema";
import { ObjectId } from "mongoose";

function generatePhoneNumber(): string {
  let phoneNumber = "5";
  for (let i = 0; i < 9; i++) {
    phoneNumber += Math.floor(Math.random() * 10).toString();
  }
  return phoneNumber;
}

const randomNum = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const addGolden = async (
  userId: ObjectId,
  order: string,
  payment: string,
  signature: string
): Promise<boolean> => {
  try {
    const lastGoldenFund = await GoldenFund.findOne().sort({ $natural: -1 });

    const newGoldenFund = new GoldenFund({
      myId: lastGoldenFund ? lastGoldenFund.myId + 1 : 1,
      userId,
      fund: 0,
      reserveFund: 0,
      orderId: order,
      paymentId: payment,
      signature,
    });

    const savedGoldenFund = await newGoldenFund.save();

    let remained = 390;
    let fund = 0;

    let remain = savedGoldenFund.myId % 2;
    let notEvenNum = savedGoldenFund.myId - remain;
    let oneByTwoNum = notEvenNum / 2;

    for (let num = 1; oneByTwoNum >= 1; num++) {
      remain = oneByTwoNum % 2;
      notEvenNum = oneByTwoNum - remain;
      oneByTwoNum = notEvenNum / 2;

      switch (num) {
        case 1:
          remained -= fund = 250;
          break;
        case 2:
          remained -= fund = 125;
          break;
        default:
          if (oneByTwoNum == 3 || oneByTwoNum == 2) {
            remained -= fund = 10;
          } else if (oneByTwoNum === 1) {
            remained -= fund = 5;
          } else fund = 0;
      }

      if (fund > 0) {
        await goldenFund(oneByTwoNum, fund, savedGoldenFund.myId);
      }
    }

    if (remained > 0) {
      await GoldenFund.findByIdAndUpdate(savedGoldenFund._id, {
        reserveFund: remained,
      });
    }

    return true;
  } catch (e) {
    console.log("Error in addGolden function:", e);
    return false;
  }
};

const addDiamond = async (
  userId: ObjectId,
  order: string,
  payment: string,
  signature: string
): Promise<boolean> => {
  try {
    const lastDiamondFund = await DiamondFund.findOne().sort({ $natural: -1 });

    const newDiamondFund = new DiamondFund({
      myId: lastDiamondFund ? lastDiamondFund.myId + 1 : 1,
      userId,
      fund: 0,
      reserveFund: 0,
      orderId: order,
      paymentId: payment,
      signature,
    });

    const savedDiamondFund = await newDiamondFund.save();

    let remained = 780;
    let fund = 0;

    let remain = savedDiamondFund.myId % 2;
    let notEvenNum = savedDiamondFund.myId - remain;
    let oneByTwoNum = notEvenNum / 2;

    for (let num = 1; oneByTwoNum >= 1; num++) {
      remain = oneByTwoNum % 2;
      notEvenNum = oneByTwoNum - remain;
      oneByTwoNum = notEvenNum / 2;

      switch (num) {
        case 1:
          remained -= fund = 500;
          break;
        case 2:
          remained -= fund = 250;
          break;
        default:
          if (oneByTwoNum == 3 || oneByTwoNum == 2) {
            remained -= fund = 20;
          } else if (oneByTwoNum == 1) {
            remained -= fund = 10;
          } else fund = 0;
      }

      if (fund > 0) {
        await diamondFund(oneByTwoNum, fund, savedDiamondFund.myId);
      }
    }

    if (remained > 0) {
      await DiamondFund.findByIdAndUpdate(savedDiamondFund._id, {
        reserveFund: remained,
      });
    }

    return true;
  } catch (e) {
    console.log("Error in addDiamond function:", e);
    return false;
  }
};

const autoBuyFund = async (): Promise<{ success: boolean }> => {
  try {
    const golden = randomNum(1, 6);
    const diamond = randomNum(1, 6);
    const phoneNumber = generatePhoneNumber();

    const isUserPhone = await User.findOne({ contact: phoneNumber });

    if (isUserPhone) {
      for (let g = 0; g < golden; g++) {
        await addGolden(
          isUserPhone._id,
          "mockorder",
          "mockpayment",
          "mocksignature"
        );
      }

      for (let d = 0; d < diamond; d++) {
        await addDiamond(
          isUserPhone._id,
          "mockorder",
          "mockpayment",
          "mocksignature"
        );
      }

      return { success: true };
    } else {
      // AutoRegistration();
      return { success: false };
    }
  } catch (error) {
    console.log("Error in autoBuyFund:", error);
    return { success: false };
  }
};

export default autoBuyFund;
