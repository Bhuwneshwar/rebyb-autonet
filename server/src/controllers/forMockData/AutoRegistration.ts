import { Request, Response } from "express";
import { addNewFunder } from "../addNewFunder";
import Admin from "../../models/AdminSchema";
import User from "../../models/UsersSchema";
import material from "../../utils/Materials.json";
import buyFunds from "../buyFunds";
import { IReq } from "../../types";

const AutoRegistration = async (req: Request, res: Response) => {
  try {
    if (res) res.send("Hello Mic Testing... ");

    const pickup = <T>(arr: T[]): T => {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    };

    const randomNum = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const generatePhoneNumber = (): string => {
      let phoneNumber = "5";
      for (let i = 0; i < 9; i++) {
        phoneNumber += Math.floor(Math.random() * 10);
      }
      return phoneNumber;
    };

    const validPriority: string[] = ["recharge", "nextInvest", "withdraw"];

    const generateReferCode = (length: number): string => {
      const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let referCode = "";

      for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        referCode += characters.charAt(randomIndex);
      }
      return referCode;
    };

    const recallFun = async () => {
      try {
        const golden = randomNum(1, 6);
        const diamond = randomNum(1, 6);
        const phoneNumber = generatePhoneNumber();

        console.log("golden X ", golden);
        console.log("diamond X ", diamond);

        const isUserPhone = await User.findOne({ contact: phoneNumber });

        if (isUserPhone) {
          console.log("contact found");
          await buyFunds(
            golden,
            diamond,
            isUserPhone._id,
            "order: any",
            "signature: any",
            "payment: any"
          );
        } else {
          console.log("contact not found");
          const f = await Admin.findByIdAndUpdate(
            "666096de9c3eceb038715e33",
            {
              $inc: {
                Multiple: 1,
              },
            },
            { new: true }
          );

          let count = f?.Multiple;

          let shuffledChild = Array.from(validPriority).sort(
            () => 0.5 - Math.random()
          );

          let userExist = true;
          let referCode;
          while (userExist) {
            referCode = generateReferCode(20);
            console.log(referCode);
            const Exist = await User.findOne({ referCode });
            if (Exist) {
              userExist = true;
            } else {
              userExist = false;
            }
          }

          //create interface for session
          interface Isession {
            name: string;
            age: number;
            gender: string;
            phoneVerified: string;
            emailVerified: string;
            transactionMethod: string;
            upi: string;
            ifsc: string;
            bank: number;
            autoWithdraw: boolean;
            NextInvest: boolean;
            autoRecharge: boolean;
            diamond: number;
            golden: number;
            PriorityNo_1: string;
            PriorityNo_2: string;
            PriorityNo_3: string;
            setRefer?: string;
            WithdrawPerc: number;
            rechNum1?: string;
            opera1?: string;
            state1?: string;
            ExistingValidityOne?: number;
            SelectedPlan1?: string;
            rechNum2?: string;
            opera2?: string;
            state2?: string;
            ExistingValidityTwo?: number;
            SelectedPlan2?: string;
            rechNum3?: string;
            opera3?: string;
            state3?: string;
            ExistingValidityThree?: number;
            SelectedPlan3?: string;
          }

          interface Iobj {
            session: Isession;
          }

          const obj: Iobj = {
            session: {
              name: "user" + referCode,
              age: randomNum(10, 99),
              gender: pickup<string>(material.genders),
              phoneVerified: phoneNumber,
              emailVerified: `userRef${referCode}@email.com`,
              transactionMethod: pickup(material.transactionMethods),
              upi: "krabi6563@oksbi",
              autoWithdraw: pickup([true, false]),
              NextInvest: pickup([true, false]),
              autoRecharge: pickup([true, false]),
              diamond,
              golden,
              PriorityNo_1: shuffledChild[0],
              PriorityNo_2: shuffledChild[1],
              PriorityNo_3: shuffledChild[2],
              setRefer: referCode,
              ifsc: "TESTIFSCCODE12652",
              bank: 40540372127,
              WithdrawPerc: randomNum(1, 100),
            },
          };

          let mobiles = randomNum(0, 3);
          while (obj.session.golden + obj.session.diamond < mobiles) {
            mobiles = randomNum(0, 3);
          }

          for (let n = 1; mobiles >= n; n++) {
            if (n === 1) {
              obj.session.rechNum1 = generatePhoneNumber();
              obj.session.opera1 = pickup(material.operators);
              obj.session.state1 = pickup(material.states);
              obj.session.ExistingValidityOne = randomNum(0, 30);
              obj.session.SelectedPlan1 = JSON.stringify(
                pickup(material.RechargePlans.jio)
              );
            }
            if (n === 2) {
              obj.session.rechNum2 = generatePhoneNumber();
              obj.session.opera2 = pickup(material.operators);
              obj.session.state2 = pickup(material.states);
              obj.session.ExistingValidityTwo = randomNum(0, 30);
              obj.session.SelectedPlan2 = JSON.stringify(
                pickup(material.RechargePlans.airtel)
              );
            }
            if (n === 3) {
              obj.session.rechNum3 = generatePhoneNumber();
              obj.session.opera3 = pickup(material.operators);
              obj.session.state3 = pickup(material.states);
              obj.session.ExistingValidityThree = randomNum(0, 30);
              obj.session.SelectedPlan3 = JSON.stringify(
                pickup(material.RechargePlans.vi)
              );
            }
          }

          const registrade = await addNewFunder(
            obj,
            "test_signature",
            "razorpay_order_id",
            "razorpay_payment_id",
            "testaccesstoken",
            true
          );

          if (registrade.success) console.log("registration successful ");

          console.log("AutoRegistration Completed");

          // const now = new Date();
          // const options = { hour: "numeric", minute: "2-digit", hour12: true };
          // const formattedTime = now.toLocaleTimeString(undefined, options);
          // console.log(formattedTime);
        }
        recallFun();
      } catch (e) {
        console.log(e);
      }
    };

    recallFun();

    /*
    // Example code to be migrated, commented out for now

    console.log("AutoRegistration Completed EveryThreeH");
    const now = new Date();
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    const formattedTime = now.toLocaleTimeString(undefined, options);
    console.log(formattedTime);
    return formattedTime;
    */
  } catch (e) {
    console.log("AutoRegistration error :", e);
  }
};

export default AutoRegistration;
