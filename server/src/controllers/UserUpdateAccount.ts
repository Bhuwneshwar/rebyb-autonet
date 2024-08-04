import User from "../models/UsersSchema";
import DiamondFund from "../models/diamondSchema";
import GoldenFund from "../models/goldenSchema";
// import { Document } from "mongoose";

interface FundIds {
  golden: string[];
  diamond: string[];
}

const UserUpdateAccount = async (fundIds: FundIds) => {
  try {
    // Remove duplicates and sort the arrays
    fundIds.golden = [...new Set(fundIds.golden)]
      .sort((a, b) => +a - +b)
      .filter((num) => +num > 3);
    fundIds.diamond = [...new Set(fundIds.diamond)]
      .sort((a, b) => +a - +b)
      .filter((num) => +num > 3);

    // Fetch users from GoldenFund and DiamondFund based on filtered fundIds
    const goldenUsers = await GoldenFund.find({
      myId: { $in: fundIds.golden },
    });
    const diamondUsers = await DiamondFund.find({
      myId: { $in: fundIds.diamond },
    });

    // Combine and get unique users from both funds
    const allUsers = [
      ...new Set([
        ...goldenUsers.map((user) => user.userId.toString()),
        ...diamondUsers.map((user) => user.userId.toString()),
      ]),
    ];

    // Update each user's account asynchronously
    await Promise.all(
      allUsers.map(async (userId) => {
        await UserUpdate(userId);
      })
    );
  } catch (e) {
    console.log(e);
  }
};

const UserUpdate = async (_id: string) => {
  try {
    const user = await User.findById(_id);
    if (!user) {
      console.log(`User with ID ${_id} not found.`);
      return;
    }

    const { updatedAt, incomes, expenses, Balance } = user;

    // Calculate total income from GoldenFunds and DiamondFunds
    let totalIncome = 0;

    const calculateTotalIncome = (funds: any[]) => {
      funds.forEach((fund) => {
        fund.fundReturnHistory.forEach(
          (history: { time: any; amount: any }) => {
            const historyTime = new Date(history.time);
            const updateDateTime = new Date(updatedAt);
            if (historyTime > updateDateTime) {
              totalIncome += history.amount;
            }
          }
        );
      });
    };

    const GoldenFundsOfUser = await GoldenFund.find({ userId: _id });
    const DiamondFundsOfUser = await DiamondFund.find({ userId: _id });

    calculateTotalIncome(GoldenFundsOfUser);
    calculateTotalIncome(DiamondFundsOfUser);

    // Calculate total referral money

    // Calculate total referral money using reduce method

    const totalReferralMoney = incomes?.referralAmount.reduce(
      (total: number, obj) => {
        const objTime = new Date(obj.date); // Parse obj.time as Date
        const updateTime = updatedAt;

        if (objTime > updateTime) {
          return total + +obj.amount; // Convert obj.amount to number if needed
        }
        return total;
      },
      0
    );

    // Calculate total top-up amount
    const totalTopUpAmount = incomes?.topupAmount.reduce(
      (total: number, obj) => {
        const objTime = new Date(obj.date);
        const updateTime = new Date(updatedAt);
        if (objTime > updateTime) {
          return total + +obj.amount;
        }
        return total;
      },
      0
    );

    interface Income {
      amount: number;
      time: Date;
      from: string;
    }
    // Calculate total user amount
    const totalUserAmount = incomes?.userAmount.reduce((total: number, obj) => {
      const objTime = new Date(obj.date);
      const updateTime = new Date(updatedAt);
      if (objTime > updateTime) {
        return total + +obj.amount;
      }
      return total;
    }, 0);

    // Calculate total expenses
    const totalExpenses = expenses?.recharge.reduce((total: number, obj) => {
      const objTime = new Date(obj.date);
      const updateTime = new Date(updatedAt);
      if (objTime > updateTime) {
        return total + +obj.plan;
      }
      return total;
    }, 0);

    // Calculate new balance
    const newBalance =
      totalIncome +
      (totalReferralMoney || 0) +
      (totalTopUpAmount || 0) +
      (totalUserAmount || 0) +
      Balance -
      (totalExpenses || 0);

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        Balance: newBalance,
        updatedDate: new Date(),
      },
      { new: true }
    );

    console.log(
      `User with ID ${_id} updated successfully. New balance: ${updatedUser?.Balance}`
    );
  } catch (e) {
    console.log(`Error updating user with ID ${_id}:`, e);
  }
};

export { UserUpdate, UserUpdateAccount };
