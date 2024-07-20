import { Request } from "express";
import material from "../utils/Materials.json";
import identification from "../middleware/identification";
import { IReq } from "../types";

interface IBody {
  name: string;
  age: number;
  gender: string;
  phoneNumber: number;
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

    const Ok: any = {};

    const trimmedName = name.trim();
    const regexName = /^[a-zA-Z]{3,30}(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    if (regexName.test(trimmedName)) {
      Ok["name"] = trimmedName;
    } else {
      return { status: false, message: "Invalid name" };
    }

    if (typeof +age === "number" && +age >= 9 && +age <= 120) {
      Ok["age"] = +age;
    } else {
      return { status: false, message: "Invalid age" };
    }

    if (typeof gender === "string" && material.genders.includes(gender)) {
      Ok["gender"] = gender;
    } else {
      return { status: false, message: "Invalid gender" };
    }

    if (phoneNumber) {
      // additional validation for phone number can be added here
      Ok["phoneNumber"] = phoneNumber;
    } else {
      return { status: false, message: "Contact number is required" };
    }

    // Assuming req.session.phoneVerifiedTime and req.session.phoneVerified are used for verification
    let dueTime = 0;
    if (req.session.phoneVerifiedTime) {
      dueTime = Date.now() - req.session.phoneVerifiedTime || 0;
      if (phoneNumber === req.session.phoneVerified && dueTime < 60 * 60000) {
        Ok["phoneVerified"] = req.session.phoneVerified;
      } else {
        return {
          status: false,
          message: "This contact number is not verified",
        };
      }
    }

    if (typeof email === "string") {
      Ok["email"] = email;
    } else {
      return { status: false, message: "Email ID is required" };
    }
    if (req.session.emailVerifiedTime && req.session.emailVerified) {
      dueTime = Date.now() - req.session.emailVerifiedTime;
      if (email === req.session.emailVerified && dueTime < 60 * 60000) {
        Ok["email"] = req.session.emailVerified;
      } else {
        return { status: false, message: "This email ID is not verified" };
      }
    }

    if (typeof +diamond === "number" && typeof +golden === "number") {
      diamond = +diamond;
      golden = +golden;
      if (diamond > 0 || golden > 0) {
        if (diamond >= 0 && diamond <= 6) {
          Ok["diamond"] = diamond;
        } else {
          return {
            status: false,
            message: "DiamondFund should be between 1-6",
          };
        }

        if (golden >= 0 && golden <= 6) {
          Ok["golden"] = golden;
        } else {
          return { status: false, message: "GoldenFund should be between 1-6" };
        }
      } else {
        return { status: false, message: "At least choose one fund" };
      }
    } else {
      return { status: false, message: "Invalid Golden or Diamond fund" };
    }

    if (typeof NextInvest === "boolean") {
      Ok["NextInvest"] = NextInvest;
    } else {
      return { status: false, message: "NextInvest should be true or false" };
    }

    // Validation functions
    const validateNumber = (num: string): boolean => {
      const contactRegex = /([5-9]{1}[0-9]{9})$/;
      return contactRegex.test(num);
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
          rechNum++;
          Ok["rechNum1"] = filteredNum1;
        } else {
          return { status: false, message: "Recharge number 1 is invalid" };
        }

        if (typeof state1 === "string") {
          if (validateState(state1)) {
            Ok["state1"] = state1;
          } else {
            return { status: false, message: "Invalid state1" };
          }
        } else {
          return {
            status: false,
            message: "State is required if number is valid",
          };
        }

        if (typeof opera1 === "string") {
          if (validateOperator(opera1)) {
            Ok["opera1"] = opera1;
          } else {
            return { status: false, message: "Invalid operator 1" };
          }
        } else {
          return {
            status: false,
            message: "Operator is required if number is valid",
          };
        }

        if (
          typeof SelectedPlan1 === "string" &&
          checkPlan(opera1, SelectedPlan1)
        ) {
          Ok["SelectedPlan1"] = SelectedPlan1;
        } else {
          return { status: false, message: "SelectedPlan1 is required" };
        }

        if (
          typeof +ExistingValidityOne === "number" &&
          +ExistingValidityOne >= 0 &&
          +ExistingValidityOne <= 365
        ) {
          Ok["ExistingValidityOne"] = +ExistingValidityOne;
        } else {
          return { status: false, message: "Invalid ExistingValidityOne" };
        }
      }
    }

    // Recharge 2 validation (similar structure to Recharge 1)
    if (rechNum2 !== "") {
      if (typeof rechNum2 === "string") {
        const filteredNum2 = validateNumber(rechNum2);
        if (filteredNum2) {
          rechNum++;
          Ok["rechNum2"] = filteredNum2;
        } else {
          return { status: false, message: "Recharge number 2 is invalid" };
        }

        if (typeof state2 === "string") {
          if (validateState(state2)) {
            Ok["state2"] = state2;
          } else {
            return { status: false, message: "Invalid state2" };
          }
        } else {
          return {
            status: false,
            message: "State is required if number is valid",
          };
        }

        if (typeof opera2 === "string") {
          if (validateOperator(opera2)) {
            Ok["opera2"] = opera2;
          } else {
            return { status: false, message: "Invalid operator 2" };
          }
        } else {
          return {
            status: false,
            message: "Operator is required if number is valid",
          };
        }

        if (
          typeof SelectedPlan2 === "string" &&
          checkPlan(opera2, SelectedPlan2)
        ) {
          Ok["SelectedPlan2"] = SelectedPlan2;
        } else {
          return { status: false, message: "SelectedPlan2 is required" };
        }

        if (
          typeof +ExistingValiditytwo === "number" &&
          +ExistingValiditytwo >= 0 &&
          +ExistingValiditytwo <= 365
        ) {
          Ok["ExistingValiditytwo"] = +ExistingValiditytwo;
        } else {
          return { status: false, message: "Invalid ExistingValiditytwo" };
        }
      }
    }

    // Recharge 3 validation (similar structure to Recharge 2)
    if (rechNum3 !== "") {
      if (typeof rechNum3 === "string") {
        const filteredNum3 = validateNumber(rechNum3);
        if (filteredNum3) {
          rechNum++;
          Ok["rechNum3"] = filteredNum3;
        } else {
          return { status: false, message: "Recharge number 3 is invalid" };
        }

        if (typeof state3 === "string") {
          if (validateState(state3)) {
            Ok["state3"] = state3;
          } else {
            return { status: false, message: "Invalid state3" };
          }
        } else {
          return {
            status: false,
            message: "State is required if number is valid",
          };
        }

        if (typeof opera3 === "string") {
          if (validateOperator(opera3)) {
            Ok["opera3"] = opera3;
          } else {
            return { status: false, message: "Invalid operator 3" };
          }
        } else {
          return {
            status: false,
            message: "Operator is required if number is valid",
          };
        }

        if (
          typeof SelectedPlan3 === "string" &&
          checkPlan(opera3, SelectedPlan3)
        ) {
          Ok["SelectedPlan3"] = SelectedPlan3;
        } else {
          return { status: false, message: "SelectedPlan3 is required" };
        }

        if (
          typeof +ExistingValiditythree === "number" &&
          +ExistingValiditythree >= 0 &&
          +ExistingValiditythree <= 365
        ) {
          Ok["ExistingValiditythree"] = +ExistingValiditythree;
        } else {
          return { status: false, message: "Invalid ExistingValiditythree" };
        }
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
    } else {
      return { status: false, message: "autoRecharge should be true or false" };
    }

    // Transaction method validation
    if (typeof transactionMethod === "string" && transactionMethod === "") {
      // Handle logic for each transaction method (upi, netbanking, both)
    } else if (typeof transactionMethod === "string") {
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
            } else
              return { status: false, message: "account number is invalid" };
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
            } else
              return { status: false, message: "account number is invalid" };
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
        default:
          return { status: false, message: "Invalid transactionMethod" };
      }
    } else {
      return { status: false, message: "Invalid transactionMethod" };
    }

    if (autoWithdraw === false || autoWithdraw === true) {
      Ok["autoWithdraw"] = autoWithdraw;
    } else {
      return { status: false, message: "autoWithdraw should be true or false" };
    }

    if (typeof refer === "string") {
      Ok["refer"] = refer;
    } else {
      return { status: false, message: "refer is required" };
    }

    if (typeof setRefer === "string") {
      Ok["setRefer"] = setRefer;
    } else {
      return { status: false, message: "setRefer is required" };
    }

    if (
      typeof +withdraw_perc === "number" &&
      +withdraw_perc >= 1 &&
      +withdraw_perc <= 100
    ) {
      Ok["withdraw_perc"] = +withdraw_perc;
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

    return { status: true, message: "Ok", data: Ok };
  } catch (error) {
    return { status: false, message: "Validation failed", error: error };
  }
};

export default validation;
