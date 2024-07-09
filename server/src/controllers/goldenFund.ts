import GoldenFund from "../models/goldenSchema";
import User from "../models/UsersSchema";

const goldenFund = async (myId: number, fund: number): Promise<any> => {
  try {
    const addedGoldenFund = await GoldenFund.updateOne(
      { myId },
      {
        $inc: { fund },
        $push: {
          fundReturnHistory: {
            many: fund,
            when: Date.now(),
          },
        },
      }
    );

    const goldenFundRecord = await GoldenFund.findOne({ myId });
    if (!goldenFundRecord) {
      throw new Error("GoldenFund record not found for myId: " + myId);
    }

    const balanceAdded = await User.findByIdAndUpdate(
      goldenFundRecord.userId,
      {
        $inc: { Balance: fund },
      },
      { new: true }
    );

    if (!balanceAdded) {
      throw new Error("User not found for userId: " + goldenFundRecord.userId);
    }

    return balanceAdded;
  } catch (e) {
    console.log("goldenFund error :", e);
    throw e; // Re-throw the error to be handled by the caller
  }
};

export default goldenFund;
