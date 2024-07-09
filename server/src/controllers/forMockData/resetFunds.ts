import DiamondFund from "../../models/diamondSchema";
import GoldenFund from "../../models/goldenSchema";
import User from "../../models/UsersSchema";
import Admin from "../../models/AdminSchema";
import AdminHome from "../../models/AdminHome";

const ResetFunds = async (): Promise<boolean> => {
  try {
    const deletedGoldenFund = await GoldenFund.deleteMany({});
    const deletedDiamondFund = await DiamondFund.deleteMany({});
    const deletedUsers = await User.deleteMany({});
    const deletedAdmins = await Admin.deleteMany({});
    const deletedAdminHome = await AdminHome.deleteMany();

    if (deletedGoldenFund && deletedDiamondFund) {
      console.log("All records have been deleted");

      const newUser = new User({
        name: "Bhuwneshwar Mandal",
        age: 24,
        gender: "male",
        contact: "6205085598",
        email: "krabi6563@gmail.com",
        referCode: "rebyb",
        autoWithdraw: true,
        autoRecharge: true,
        NextInvest: true,
        expenses: {
          recharge: {
            amount: 0,
          },
          userSend: {
            amount: 0,
          },
          withdrawOnBank: {
            amount: 0,
          },
        },
        incomes: {
          referralAmount: {
            amount: 0,
          },
          topupAmount: {
            amount: 0,
          },
          userAmount: {
            amount: 0,
          },
        },
      });

      const savedUser = await newUser.save();
      console.log(savedUser);

      const newGoldenFund = new GoldenFund({
        myId: 1,
        userId: savedUser._id,
        fund: 0,
        reserveFund: 500,
        orderId: "orderidsample",
        paymentId: "paymentidsample",
        signature: "validsignature",
      });
      const savedGoldenFund = await newGoldenFund.save();
      console.log("Saved Golden Fund:", savedGoldenFund);

      const newDiamondFund = new DiamondFund({
        myId: 1,
        userId: savedUser._id,
        fund: 0,
        reserveFund: 1000,
        orderId: "orderidsample",
        paymentId: "paymentidsample",
        signature: "validsignature",
      });
      const savedDiamondFund = await newDiamondFund.save();
      console.log("Saved Diamond Fund:", savedDiamondFund);

      const newAdmin = new Admin({
        CountUp: 0,
        Multiple: 0,
      });
      const savedAdmin = await newAdmin.save();
      console.log("Saved Admin:", savedAdmin);

      return true;
    } else {
      console.log("Failed to delete funds");
      return false;
    }
  } catch (error) {
    console.error("Error in ResetFunds:", error);
    return false;
  }
};

export default ResetFunds;