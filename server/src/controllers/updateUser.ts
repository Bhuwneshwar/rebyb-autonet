import { Request, Response } from "express";
import User from "../models/UsersSchema";
import { IReq } from "../types";

// Controller function to update user details
const updateUser = async (req: IReq, res: Response) => {
  try {
    console.log({ ...req.body });

    // Destructure req.body for easier access
    const {
      name,
      age,
      gender,
      phoneNumber,
      email,
      NextInvest,
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
      autoWithdraw,
      refer,
      withdraw_perc,
      priority,
      ExistingValidityOne,
      ExistingValiditytwo,
      ExistingValiditythree,
      SelectedPlan1,
      SelectedPlan2,
      SelectedPlan3,
    } = req.body;

    // Validate and sanitize each field
    for (const [key, value] of Object.entries(req.body)) {
      if (key === "name") {
        if (typeof value === "string") {
          const trimmedName = name.trim();
          const regexName = /^[a-zA-Z]{3,60}(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
          if (regexName.test(trimmedName)) {
            req.body.name = trimmedName;
          } else {
            return res
              .status(400)
              .send({ status: false, error: "Invalid name format" });
          }
        } else {
          return res
            .status(400)
            .send({ status: false, error: "Invalid name type" });
        }
      }

      if (key === "age") {
        if (typeof value === "number" && value >= 10 && value <= 99) {
          req.body.age = value;
        } else {
          return res
            .status(400)
            .send({ status: false, error: "Invalid age format" });
        }
      }

      if (key === "gender") {
        if (
          typeof value === "string" &&
          ["male", "female", "other"].includes(value.toLowerCase())
        ) {
          req.body.gender = value.toLowerCase();
        } else {
          return res
            .status(400)
            .send({ status: false, error: "Invalid gender" });
        }
      }

      if (key === "contact") {
        return res
          .status(400)
          .send({ status: false, error: "You need to send OTP" });
      }
    }

    // Update user document in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { ...req.body },
      { new: true }
    );

    console.log({ updatedUser });
    res.status(200).send({ success: true, ...req.body });
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export { updateUser };
