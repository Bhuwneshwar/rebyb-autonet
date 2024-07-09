import DiamondFund from "../models/diamondSchema";
import User from "../models/UsersSchema";

const diamondFund = async (myId: number, fund: number): Promise<any> => {
  try {
    const addedDiamondFund = await DiamondFund.updateOne(
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

    const diamondFundRecord = await DiamondFund.findOne({ myId });
    if (!diamondFundRecord) {
      throw new Error("DiamondFund record not found for myId: " + myId);
    }

    const balanceAdded = await User.findByIdAndUpdate(
      diamondFundRecord.userId,
      {
        $inc: { Balance: fund },
      },
      { new: true }
    );

    if (!balanceAdded) {
      throw new Error("User not found for userId: " + diamondFundRecord.userId);
    }

    return balanceAdded;
  } catch (e) {
    console.log("diamondFund error :", e);
    throw e; // Re-throw the error to be handled by the caller
  }
};

export default diamondFund;
