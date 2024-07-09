import AdminHome from "../models/AdminHome";
import User, { IUser } from "../models/UsersSchema";
import GoldenFund from "../models/goldenSchema";
import DiamondFund from "../models/diamondSchema";
import { Response } from "express";
import { ObjectId } from "mongoose";

const pushWithdraw = async (
  UserId: ObjectId,
  Type: string,
  Method?: string,
  upi?: string,
  ifsc?: string,
  bank?: string,
  Amount?: number
) => {
  try {
    const alreadyWork = await AdminHome.findOne({
      UserId,
      Type,
      Method,
      upi,
      ifsc,
      bank,
    });

    let work;
    if (alreadyWork) {
      work = await AdminHome.updateOne(
        { UserId },
        {
          $inc: {
            Amount,
          },
        },
        { new: true }
      );
    } else {
      work = new AdminHome({
        UserId,
        transactionMethod: Method,
        ifsc,
        bank,
        upi,
        Amount,
        Type,
      });
      work = await work.save();
    }

    if (work) {
      const upgrade = await User.findByIdAndUpdate(
        UserId,
        {
          $inc: {
            Balance: -(Amount || 0),
          },
        },
        { new: true }
      );
      console.log(upgrade);
    }
  } catch (e) {
    console.log("pushWithdraw error :", e);
  }
};

const pushRecharge = async (
  UserId: ObjectId,
  {
    number,
    state,
    operator,
  }: { number: string; state: string; operator: string },
  plan: number,
  Type: string
) => {
  try {
    const work = new AdminHome({
      UserId,
      number,
      state,
      operator,
      plan,
      Type,
    });

    const done = await work.save();

    if (done) {
      const upgrade = await User.findByIdAndUpdate(
        UserId,
        {
          $inc: {
            Balance: -plan,
          },
        },
        { new: true }
      );
      return true;
    }

    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const getDays = (reg: Date) => {
  const regDate = new Date(reg);
  const currentDate = new Date();
  const diffMilliseconds = currentDate.getTime() - regDate.getTime();
  const diffdays = diffMilliseconds / (1000 * 60 * 60 * 24);
  console.log(diffdays);
  return diffdays;
};

const moneyManager = async (iden: ObjectId | null, res: Response) => {
  try {
    let upgrade: IUser | null;

    if (iden) {
      upgrade = await User.findById(iden);
    } else {
      upgrade = await User.findOne({ contact: "6205085591" });
    }
    console.log(upgrade);
    if (!upgrade) return res.send({ error: "user not found" });
    const {
      _id,
      Priority: { no_1, no_2, no_3 },
      autoRecharge,
      autoWithdraw,
      NextInvest,
      withdrawPerc,
    } = upgrade;

    const num1Plan = 299;
    const num2Plan = 199;
    const num3Plan = 149;

    const recursive = async (nom: string) => {
      try {
        if (!upgrade) return false;
        switch (nom) {
          case "recharge":
            console.log("recharge run");

            if (autoRecharge) {
              if (upgrade?.rechargeNum1?.number) {
                const days = getDays(upgrade.rechargeNum1.rechargedAt);
                if (upgrade.rechargeNum1.validity - 5 < days) {
                  const already = await AdminHome.findOne({
                    number: upgrade.rechargeNum1.number,
                  });
                  if (!already) {
                    if (num1Plan < upgrade.Balance) {
                      await pushRecharge(
                        _id,
                        upgrade.rechargeNum1,
                        num1Plan,
                        "recharge"
                      );
                    } else return false;
                  }
                }
              }

              if (upgrade?.rechargeNum2?.number) {
                const days = getDays(upgrade.rechargeNum2.rechargedAt);
                if (upgrade.rechargeNum2.validity - 5 < days) {
                  const already = await AdminHome.findOne({
                    number: upgrade.rechargeNum2.number,
                  });
                  if (!already) {
                    if (num2Plan < upgrade.Balance) {
                      await pushRecharge(
                        _id,
                        upgrade.rechargeNum2,
                        num2Plan,
                        "recharge"
                      );
                    } else return false;
                  }
                }
              }

              if (upgrade?.rechargeNum3?.number) {
                const days = getDays(upgrade.rechargeNum3.rechargedAt);
                if (upgrade.rechargeNum3.validity - 5 < days) {
                  const already = await AdminHome.findOne({
                    number: upgrade.rechargeNum3.number,
                  });
                  if (!already) {
                    if (num3Plan < upgrade.Balance) {
                      await pushRecharge(
                        _id,
                        upgrade.rechargeNum3,
                        num3Plan,
                        "recharge"
                      );
                    } else return false;
                  }
                }
              }
            }
            return true;
          case "nextInvest":
            console.log("nextInvest run");

            let Next = true;

            if (NextInvest) {
              const golden = await GoldenFund.find({
                userId: upgrade?._id,
              }).countDocuments();
              const diamond = await DiamondFund.find({
                userId: upgrade?._id,
              }).countDocuments();

              const latestG = golden - upgrade.nextInvestCountG;
              const latestD = diamond - upgrade.nextInvestCountD;

              let remainBalance = 0,
                totalG = 0,
                totalD = 0,
                countG = 0,
                forG = 0,
                forD = 0,
                countD = 0;

              if (upgrade.Balance > 500) {
                countG = Math.floor(upgrade.Balance / 500);
                if (latestG > countG) {
                  forG = countG;
                  totalG = 500 * countG;
                  remainBalance = upgrade.Balance - totalG;
                  Next = false;
                } else {
                  forG = latestG;
                  totalG = 500 * latestG;
                  remainBalance = upgrade.Balance - totalG;
                }
              }

              if (remainBalance > 1000) {
                countD = Math.floor(remainBalance / 1000);
                if (latestD > countD) {
                  forD = countD;
                  totalD = 1000 * countD;
                  remainBalance = remainBalance - totalD;
                  Next = false;
                } else {
                  forD = latestD;
                  totalD = 1000 * latestD;
                  remainBalance = remainBalance - totalD;
                }
              }

              const totalMoneyForInvest = totalG + totalD;
              if (forG > 0 || forD > 0) {
                const updated = await User.findByIdAndUpdate(
                  upgrade._id,
                  {
                    $inc: {
                      nextInvestCountG: forG,
                      nextInvestCountD: forD,
                      nextInvestForMoney: totalMoneyForInvest,
                    },
                    Balance: remainBalance,
                  },
                  { new: true }
                );
                upgrade = updated;
              }
            }
            return Next;
          case "withdraw":
            console.log("withdraw run");
            if (autoWithdraw) {
              const amount = Math.floor((upgrade.Balance / 100) * withdrawPerc);
              if (amount > 0) {
                await pushWithdraw(
                  _id,
                  "sendMoney",
                  upgrade.transactionMethod,
                  upgrade.upi,
                  upgrade.ifsc,
                  upgrade.bank,
                  amount
                );
              }
            }
            return true;
          default:
            return true;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    let next = await recursive(no_1);
    if (next) next = await recursive(no_2);
    if (next) await recursive(no_3);
  } catch (e) {
    console.log("moneyManager error :", e);
  }
};

export { moneyManager, getDays };
