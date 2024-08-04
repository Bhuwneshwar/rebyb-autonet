import GoldenFund from "../models/goldenSchema";
import User from "../models/UsersSchema";

const goldenFund = async (
  myId: number,
  fund: number,
  id: number
): Promise<any> => {
  try {
    if (myId > 3) {
      const addedGoldenFund = await GoldenFund.updateOne(
        { myId },
        {
          $inc: { fund },
          $push: {
            fundReturnHistory: {
              many: fund,
              when: Date.now(),
              who: id,
            },
          },
        },
        {
          new: true,
        }
      );
      console.log({ addedGoldenFund });
    }
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
