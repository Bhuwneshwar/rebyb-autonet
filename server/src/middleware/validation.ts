import material from "../utils/Materials.json";
import { IReq } from "../types";
import identificationService from "./identifyId";
import User from "../models/UsersSchema";

export interface IBody {
  name: string;
  age: number;
  gender: string;
  phoneNumber: string;
  email: string;
  diamond: number;
  NextInvest: boolean;
  golden: number;
  rechNum1: string;
  rechNum2: string;
  rechNum3: string;
  opera1: string;
  opera2: string;
  opera3: string;
  state1: string;
  state2: string;
  state3: string;
  autoRecharge: boolean;
  transactionMethod: string;
  upi: string;
  ifsc: string;
  bank: string;
  confirmBank: string;
  autoWithdraw: boolean;
  refer: string;
  setRefer: string;
  withdraw_perc: number;
  priority: string[];
  ExistingValidityOne: number;
  ExistingValiditytwo: number;
  ExistingValiditythree: number;
  SelectedPlan1: string;
  SelectedPlan2: string;
  SelectedPlan3: string;
}

const validation = async (req: IReq) => {
  try {
    let rechNum = 0;
    let {
      name,
      age,
      gender,
      phoneNumber,
      email,
      diamond,
      NextInvest,
      golden,
      rechNum1,
      rechNum2,
      rechNum3,
      opera1,
      opera2,
      opera3,
      state1,
      state2,
      state3,
      autoRecharge,
      transactionMethod,
      upi,
      ifsc,
      bank,
      confirmBank,
      autoWithdraw,
      refer,
      setRefer,
      withdraw_perc,
      priority,
      ExistingValidityOne,
      ExistingValiditytwo,
      ExistingValiditythree,
      SelectedPlan1,
      SelectedPlan2,
      SelectedPlan3,
    } = req.body as IBody;

    const Ok = {} as IBody;

    if (typeof name !== "string")
      return { status: false, message: "Name should be string" };
    if (name === "") return { status: false, message: "Name is required" };
    const trimmedName = name.trim();
    const regexName = /^[a-zA-Z',. -]{3,20}$/;
    if (regexName.test(trimmedName)) Ok["name"] = trimmedName;
    else return { status: false, message: "Invalid name" };

    if (!age) return { status: false, message: "Age is required" };
    if (typeof age !== "number")
      return { status: false, message: "Age should be number" };
    if (age >= 10 && age <= 99) Ok["age"] = age;
    else return { status: false, message: "Age should be between 10-99" };

    if (typeof gender !== "string")
      return { status: false, message: "Gender should be string" };
    if (gender === "") return { status: false, message: "Gender is required" };
    if (material.genders.includes(gender)) Ok["gender"] = gender;
    else return { status: false, message: "Invalid Gender" };

    if (typeof phoneNumber !== "string")
      return { status: false, message: "Phone number should be string!" };
    if (phoneNumber === "")
      return { status: false, message: "Phone number is required!" };
    const contactRegex = /^([5-9]{1}[0-9]{9})$/;
    if (!contactRegex.test(phoneNumber))
      return { status: false, message: "Invalid Phone number!" };
    if (!req.session.phoneVerified || !req.session.phoneVerifiedTime)
      return { status: false, message: "Please verify your phone number" };
    const dueTimeContact = Date.now() - req.session.phoneVerifiedTime;
    if (
      phoneNumber === req.session.phoneVerified &&
      dueTimeContact < 60 * 60000
    )
      Ok["phoneNumber"] = req.session.phoneVerified;
    else
      return {
        status: false,
        message: "This contact number is not verified",
      };

    if (typeof email !== "string")
      return { status: false, message: "Email ID should be string!" };
    if (email === "") return { status: false, message: "Email ID is required" };
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email))
      return { status: false, message: "Invalid email ID!" };
    if (!req.session.emailVerified || !req.session.emailVerifiedTime)
      return { status: false, message: "Please verify your Email ID" };
    const dueTimeEmail = Date.now() - req.session.emailVerifiedTime;
    if (email === req.session.emailVerified && dueTimeEmail < 60 * 60000)
      Ok["email"] = req.session.emailVerified;
    else
      return {
        status: false,
        message: "This Email ID is not verified",
      };

    if (typeof diamond !== "number" || typeof golden !== "number")
      return {
        status: false,
        message: "Golden & Diamond of type should be number!",
      };
    const initialFunds = [0, 1, 2, 3, 4, 5, 6];
    if (initialFunds.includes(diamond)) Ok["diamond"] = diamond;
    else
      return {
        status: false,
        message: "DiamondFund should be between 0-6",
      };
    if (initialFunds.includes(golden)) Ok["golden"] = golden;
    else return { status: false, message: "GoldenFund should be between 0-6" };
    if (diamond === 0 && golden === 0)
      return { status: false, message: "At least choose one fund" };

    if (typeof NextInvest === "boolean") Ok["NextInvest"] = NextInvest;
    else
      return { status: false, message: "NextInvest should be true or false" };

    // Validation functions
    const validateNumber = (num: string): boolean => {
      const contactRegex = /^([5-9]{1}[0-9]{9})$/;
      return contactRegex.test(num);
    };
    const checkNumber = async (phone: string) => {
      try {
        console.log({ phone });

        const exist = await User.findOne({
          $or: [
            { "rechargeNum1.number": phone },
            { "rechargeNum2.number": phone },
            { "rechargeNum3.number": phone },
          ],
        });

        console.log({ exist });
        // return !!exist;
        if (exist) return true;
        else return false;
        // res.send("this number already added on " + nums + " accounts");
      } catch (e) {
        console.log(e);
        // res.status(500).send({ error: "Server Error" });
      }
    };

    const validateState = (state: string): boolean => {
      return material.states.includes(state);
    };

    const validateOperator = (operator: string): boolean => {
      return material.operators.includes(operator);
    };

    const checkPlan = (opera: string, plan: string): boolean => {
      switch (opera) {
        case "jio":
          return material.RechargePlans.jio.some(
            (obj) => JSON.stringify(obj) === plan
          );
        case "airtel":
          return material.RechargePlans.airtel.some(
            (obj) => JSON.stringify(obj) === plan
          );
        case "vi":
          return material.RechargePlans.vi.some(
            (obj) => JSON.stringify(obj) === plan
          );
        case "bsnl":
          return material.RechargePlans.bsnl.some(
            (obj) => JSON.stringify(obj) === plan
          );
        case "mtnl delhi":
          return material.RechargePlans.mtnlDelhi.some(
            (obj) => JSON.stringify(obj) === plan
          );
        case "mtnl mumbai":
          return material.RechargePlans.mtnlMumbai.some(
            (obj) => JSON.stringify(obj) === plan
          );
        default:
          return false;
      }
    };

    // Recharge 1 validation
    if (rechNum1 !== "") {
      if (typeof rechNum1 === "string") {
        const filteredNum1 = validateNumber(rechNum1);
        if (filteredNum1) {
          const existingOnAutoRG = await checkNumber(rechNum1);
          if (existingOnAutoRG) {
            return {
              status: false,
              message: "Recharge number 1 is Existing on Auto Recharge",
            };
          }
          rechNum++;
          Ok["rechNum1"] = rechNum1;
        } else {
          return { status: false, message: "Recharge number 1 is invalid" };
        }

        if (typeof opera1 === "string") {
          if (opera1 === "")
            return { status: false, message: "Please choose Operator 1!" };
          if (validateOperator(opera1)) {
            Ok["opera1"] = opera1;
          } else {
            return { status: false, message: "Invalid operator 1" };
          }
        } else {
          return {
            status: false,
            message: "Operator is required if is number 1",
          };
        }
        if (typeof state1 === "string") {
          if (state1 === "")
            return { status: false, message: "Please choose state1!" };
          if (validateState(state1)) {
            Ok["state1"] = state1;
          } else {
            return { status: false, message: "Invalid state1" };
          }
        } else {
          return {
            status: false,
            message: "State is required if is number 1",
          };
        }

        if (
          typeof SelectedPlan1 === "string" &&
          checkPlan(opera1, SelectedPlan1)
        ) {
          Ok["SelectedPlan1"] = SelectedPlan1;
        } else {
          return { status: false, message: "Please choose plan for number 1" };
        }

        if (
          typeof ExistingValidityOne === "number" &&
          ExistingValidityOne >= 0 &&
          ExistingValidityOne <= 365
        ) {
          Ok["ExistingValidityOne"] = ExistingValidityOne;
        } else {
          return { status: false, message: "Invalid existing plan validity 1" };
        }
      }
    }

    // Recharge 2 validation (similar structure to Recharge 1)
    if (rechNum2 !== "") {
      if (typeof rechNum2 === "string") {
        const filteredNum2 = validateNumber(rechNum2);
        if (filteredNum2) {
          const existingOnAutoRG = await checkNumber(rechNum2);
          if (existingOnAutoRG) {
            return {
              status: false,
              message: "Recharge number 2 is Existing on Auto Recharge",
            };
          }
          rechNum++;
          Ok["rechNum2"] = rechNum2;
        } else
          return { status: false, message: "Recharge number 2 is invalid" };

        if (typeof opera2 === "string") {
          if (opera2 === "")
            return { status: false, message: "Please choose operator 2!" };
          if (validateOperator(opera2)) {
            Ok["opera2"] = opera2;
          } else return { status: false, message: "Invalid operator 2" };
        } else {
          return {
            status: false,
            message: "Operator is required if is number 2",
          };
        }

        if (typeof state2 === "string") {
          if (state2 === "")
            return { status: false, message: "Please choose state 2!" };

          if (validateState(state2)) {
            Ok["state2"] = state2;
          } else {
            return { status: false, message: "Invalid state2" };
          }
        } else {
          return {
            status: false,
            message: "State is required if is number 2",
          };
        }

        if (
          typeof SelectedPlan2 === "string" &&
          checkPlan(opera2, SelectedPlan2)
        ) {
          Ok["SelectedPlan2"] = SelectedPlan2;
        } else {
          return { status: false, message: "Please choose plan for number 2" };
        }

        if (
          typeof ExistingValiditytwo === "number" &&
          ExistingValiditytwo >= 0 &&
          ExistingValiditytwo <= 365
        ) {
          Ok["ExistingValiditytwo"] = ExistingValiditytwo;
        } else {
          return { status: false, message: "Invalid existing plan validity 2" };
        }
      }
    }

    // Recharge 3 validation (similar structure to Recharge 2)
    if (rechNum3 !== "") {
      if (typeof rechNum3 === "string") {
        const filteredNum3 = validateNumber(rechNum3);
        if (filteredNum3) {
          const existingOnAutoRG = await checkNumber(rechNum3);
          if (existingOnAutoRG) {
            return {
              status: false,
              message: "Recharge number 3 is Existing on Auto Recharge",
            };
          }
          rechNum++;
          Ok["rechNum3"] = rechNum3;
        } else {
          return { status: false, message: "Recharge number 3 is invalid" };
        }

        if (typeof opera3 === "string") {
          if (opera3 === "")
            return { status: false, message: "Please choose operator 3" };

          if (validateOperator(opera3)) {
            Ok["opera3"] = opera3;
          } else {
            return { status: false, message: "Invalid operator 3" };
          }
        } else {
          return {
            status: false,
            message: "Operator is required if is number 3",
          };
        }

        if (typeof state3 === "string") {
          if (state3 === "")
            return { status: false, message: "Please choose state 3" };

          if (validateState(state3)) {
            Ok["state3"] = state3;
          } else {
            return { status: false, message: "Invalid state3" };
          }
        } else {
          return {
            status: false,
            message: "State is required if is number 3",
          };
        }

        if (
          typeof SelectedPlan3 === "string" &&
          checkPlan(opera3, SelectedPlan3)
        ) {
          Ok["SelectedPlan3"] = SelectedPlan3;
        } else {
          return { status: false, message: "please choose plan 3" };
        }

        if (
          typeof ExistingValiditythree === "number" &&
          ExistingValiditythree >= 0 &&
          ExistingValiditythree <= 365
        ) {
          Ok["ExistingValiditythree"] = ExistingValiditythree;
        } else {
          return { status: false, message: "Invalid existing plan validity 3" };
        }
      }
    }

    if (rechNum > 1) {
      if (
        rechNum1 === rechNum2 ||
        rechNum2 === rechNum3 ||
        rechNum3 === rechNum1
      ) {
        return {
          status: false,
          message: "1 or 2 or 3 number should different!",
        };
      }
    }

    if (rechNum > golden + diamond) {
      return {
        status: false,
        message: `You have entered ${rechNum} numbers, so you need ${rechNum} GoldenFund or DiamondFund or more`,
      };
    }

    if (typeof autoRecharge === "boolean") {
      Ok["autoRecharge"] = autoRecharge;
    } else
      return { status: false, message: "autoRecharge should be true or false" };

    // Transaction method validation
    if (typeof transactionMethod !== "string")
      return { status: false, message: "Transaction method should be string" };
    // if (transactionMethod === "")
    //   return { status: false, message: "Transaction method is required" };
    // // Handle logic for each transaction method (upi, netbanking, both)

    switch (transactionMethod) {
      case "upi":
        if (typeof upi === "string") {
          const regexUpi = /^[\w.-]+@[\w-]+(\.[\w-]+)*$/;
          if (regexUpi.test(upi)) {
            Ok["upi"] = upi;
            Ok["transactionMethod"] = transactionMethod;
          } else {
            return { status: false, message: "UPI code is invalid" };
          }
        } else {
          return { status: false, message: "Please fill out UPI Code" };
        }
        break;
      case "net banking":
        if (typeof ifsc === "string") {
          const regexIfsc = /^[A-Z]{4}0[A-Z0-9]{6}$/;
          if (regexIfsc.test(ifsc)) {
            Ok["ifsc"] = ifsc;
          } else return { status: false, message: "IFSC code is invalid" };
        } else return { status: false, message: "please fill out IFSC Code" };

        if (typeof bank === "string") {
          const regexBank = /^[0-9]{9,18}$/;
          if (regexBank.test(bank)) {
          } else return { status: false, message: "account number is invalid" };
        } else
          return { status: false, message: "please fill out Account number" };

        if (bank === confirmBank) {
          //req.session.bank = bank;
          //req.session.transactionMethod = "both";
          Ok["bank"] = bank;
          Ok["transactionMethod"] = transactionMethod;
        } else
          return { status: false, message: "Account number can't matching" };

        break;
      case "both":
        if (typeof upi === "string") {
          const regexUpi = /^[\w.-]+@[\w-]+(\.[\w-]+)*$/;
          if (regexUpi.test(upi)) {
            Ok["upi"] = upi;
          } else return { status: false, message: "UPI code is invalid" };
        } else return { status: false, message: "please fill out UPI Code" };

        if (typeof ifsc === "string") {
          const regexIfsc = /^[A-Z]{4}0[A-Z0-9]{6}$/;
          if (regexIfsc.test(ifsc)) {
            Ok["ifsc"] = ifsc;
          } else return { status: false, message: "IFSC code is invalid" };
        } else return { status: false, message: "please fill out IFSC Code" };

        if (typeof bank === "string") {
          const regexBank = /^[0-9]{9,18}$/;
          if (regexBank.test(bank)) {
          } else return { status: false, message: "account number is invalid" };
        } else
          return { status: false, message: "please fill out Account number" };

        if (bank === confirmBank) {
          //req.session.bank = bank;
          //req.session.transactionMethod = "both";
          Ok["bank"] = bank;
          Ok["transactionMethod"] = transactionMethod;
        } else
          return { status: false, message: "Account number can't matching" };

        break;
      case "none":
        Ok["transactionMethod"] = transactionMethod;
        break;
      default:
        return { status: false, message: "Invalid transaction Method" };
    }

    if (typeof autoWithdraw === "boolean") {
      Ok["autoWithdraw"] = autoWithdraw;
    } else {
      return { status: false, message: "autoWithdraw should be true or false" };
    }

    if (typeof refer === "string") {
      if (refer !== "") {
        const isValid = await identificationService(refer);
        if (isValid.doc) {
          Ok["refer"] = refer;
        } else {
          return { status: false, message: "invalid referral Username ID" };
        }
      }
    }

    if (typeof setRefer === "string") {
      if (setRefer === "")
        return { status: false, message: "New Username ID must be provided" };
      const referRegex = /^[a-zA-Z0-9]{1,50}$/;
      if (referRegex.test(setRefer)) {
        const exist = await User.findOne({ referCode: setRefer });
        if (exist) {
          return { status: false, message: "This username ID already exists" };
        } else {
          Ok["setRefer"] = setRefer;
        }
      } else return { status: false, message: "Invalid New Username" };
    } else {
      return { status: false, message: "Invalid New Username" };
    }

    if (
      typeof withdraw_perc === "number" &&
      withdraw_perc >= 1 &&
      withdraw_perc <= 100
    ) {
      Ok["withdraw_perc"] = withdraw_perc;
    } else {
      return {
        status: false,
        message: "withdraw_perc should be between 1 to 100",
      };
    }

    const checkPriority = (priority: string) => {
      if (["recharge", "nextInvest", "withdraw"].includes(priority))
        return true;
      else return false;
    };
    if (Array.isArray(priority) && priority.length === 3) {
      if (
        checkPriority(priority[0]) &&
        checkPriority(priority[1]) &&
        checkPriority(priority[2])
      ) {
        Ok["priority"] = priority;
      } else return { status: false, message: "invalid Priority!" };
    } else return { status: false, message: "invalid Priority!" };
    console.log({ Ok });

    return { status: true, message: "Ok", data: Ok };
  } catch (error) {
    return { status: false, message: "Validation failed", error: error };
  }
};

export default validation;
