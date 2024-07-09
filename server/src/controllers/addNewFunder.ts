import User from "../models/UsersSchema";
import DiamondFund from "../models/diamondSchema";
import GoldenFund from "../models/goldenSchema";

export const addNewFunder = async (
  req: any, // Adjust type as per your actual request structure
  signature: string,
  order: string,
  payment: string,
  accessToken: string,
  MockUser?: boolean
) => {
  try {
    let referCode;
    if (req.session.setRefer) {
      referCode = req.session.setRefer;
    } else {
      referCode = generateReferCode(20);
      while (await User.findOne({ referCode })) {
        referCode = generateReferCode(20);
      }
    }

    const newUser = new User({
      name: req.session.name,
      age: req.session.age,
      gender: req.session.gender,
      contact: req.session.phoneVerified,
      email: req.session.emailVerified,
      accessToken,
      referCode,
      transactionMethod: req.session.transactionMethod,
      upi: req.session.upi,
      ifsc: req.session.ifsc,
      bank: req.session.bank,
      autoWithdraw: req.session.autoWithdraw,
      autoRecharge: req.session.autoRecharge,
      NextInvest: req.session.NextInvest,
      withdrawPerc: req.session.WithdrawPerc,
      Priority: {
        no_1: req.session.PriorityNo_1,
        no_2: req.session.PriorityNo_2,
        no_3: req.session.PriorityNo_3,
      },
      expenses: {
        recharge: { amount: 0 },
        userSend: { amount: 0 },
        withdrawOnBank: { amount: 0 },
      },
      incomes: {
        referralAmount: { amount: 0 },
        topupAmount: { amount: 0 },
        userAmount: { amount: 0 },
      },
      rechargeNum1: {
        operator: req.session.opera1,
        state: req.session.state1,
        number: req.session.rechNum1,
        validity: req.session.ExistingValidityOne,
        plan: req.session.SelectedPlan1,
      },
      rechargeNum2: {
        operator: req.session.opera2,
        state: req.session.state2,
        number: req.session.rechNum2,
        validity: req.session.ExistingValiditytwo,
        plan: req.session.SelectedPlan2,
      },
      rechargeNum3: {
        operator: req.session.opera3,
        state: req.session.state3,
        number: req.session.rechNum3,
        validity: req.session.ExistingValiditythree,
        plan: req.session.SelectedPlan3,
      },
    });

    const savedUser = await newUser.save();

    const { diamond, golden } = req.session;
    let referralMoney = 0;

    if (req.session.refer) {
      referralMoney = diamond * 20 + golden * 10;
      await User.findByIdAndUpdate(
        req.session.refer,
        {
          $push: {
            "incomes.referralAmount": {
              amount: referralMoney,
              from: savedUser._id,
            },
          },
          $inc: { Balance: referralMoney },
        },
        { new: true }
      );
    }

    const Funding = async (
      diamond: number,
      golden: number,
      savedUser: any, // Adjust type as per your User schema
      order: string,
      signature: string,
      payment: string
    ) => {
      const addGoldenBg = async (
        golden: number,
        savedUser: any,
        order: string,
        payment: string,
        signature: string
      ) => {
        for (let g = 0; g < golden; g++) {
          await addGolden(savedUser._id, order, payment, signature);
        }
        return true;
      };

      const addDiamondBg = async (
        diamond: number,
        savedUser: any,
        order: string,
        payment: string,
        signature: string
      ) => {
        for (let d = 0; d < diamond; d++) {
          await addDiamond(savedUser._id, order, payment, signature);
        }
        return true;
      };

      await Promise.all([
        addGoldenBg(golden, savedUser, order, payment, signature),
        addDiamondBg(diamond, savedUser, order, payment, signature),
      ]);
      return true;
    };

    await Funding(diamond, golden, savedUser, order, signature, payment);

    if (!MockUser) {
      req.session.destroy((err: any) => {
        if (err) console.error("Error destroying session:", err);
        else console.log("Session destroyed successfully");
      });
    }

    return {
      success: true,
      savedUser,
      referralMoney,
    };
  } catch (e: any) {
    console.error("Error adding new funder:", e);
    if (!MockUser) {
      req.session.destroy((err: any) => {
        if (err) console.error("Error destroying session:", err);
        else console.log("Session destroyed due to error");
      });
    }
    return {
      success: false,
      error: e.message || "Internal server error",
    };
  }
};

const generateReferCode = (length: number) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let referCode = "";
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    referCode += characters.charAt(randomIndex);
  }
  return referCode;
};

const addGolden = async (
  userId: string,
  order: string,
  payment: string,
  signature: string
) => {
  try {
    let lastGoldenFund = await GoldenFund.findOne().sort({ $natural: -1 });
    const newGoldenFund = new GoldenFund({
      myId: lastGoldenFund ? lastGoldenFund.myId + 1 : 1,
      userId,
      fund: 0,
      reserveFund: 0,
      orderId: order,
      paymentId: payment,
      signature,
    });
    await newGoldenFund.save();
    // Add your logic for fund allocation here if needed
    return true;
  } catch (e) {
    console.error("Error adding golden fund:", e);
    return false;
  }
};

const addDiamond = async (
  userId: string,
  order: string,
  payment: string,
  signature: string
) => {
  try {
    let lastDiamondFund = await DiamondFund.findOne().sort({ $natural: -1 });
    const newDiamondFund = new DiamondFund({
      myId: lastDiamondFund ? lastDiamondFund.myId + 1 : 1,
      userId,
      fund: 0,
      reserveFund: 0,
      orderId: order,
      paymentId: payment,
      signature,
    });
    await newDiamondFund.save();
    // Add your logic for fund allocation here if needed
    return true;
  } catch (e) {
    console.error("Error adding diamond fund:", e);
    return false;
  }
};
