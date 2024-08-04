import User from "../models/UsersSchema";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { IReq, IToken } from "../types";
import identificationService from "../middleware/identifyId";
import SendMail from "./SendMail";
import { account } from "./myAccount";

dotenv.config();

const login = async (req: Request, res: Response) => {
  res.send("hi");
};

const loginPost = async (req: IReq, res: Response) => {
  try {
    const {
      identifyId,
      password,
    }: {
      identifyId: string;
      password: string;
    } = req.body;

    if (identifyId.length === 0)
      return res.send({ error: "please enter identifyId" });
    if (password.length === 0)
      return res.send({ error: "please enter password" });

    const identified = await identificationService(identifyId);
    if (identified.error) return res.send(identified);

    let msg = "";
    switch (identified.type) {
      case "contact":
        msg = "This contact number is not registered";
        break;
      case "email":
        msg = "This email id is not registered";
        break;
      case "id":
        msg = "This id of user not found";
        break;
      case "referCode":
        msg = "This referCode of user not found";
        break;
      default:
        // code
        break;
    }

    if (!identified.doc) return res.send({ error: msg });

    if (!identified.doc.password)
      return res.send({ error: "Password not created, please try with OTP" });

    if (req.session.attempt && req.session.attempt > 10) {
      if (req.session.time && req.session.time + 1000 * 60 * 2 >= Date.now()) {
        return res.send({
          wait: req.session.time + 1000 * 60 * 2 - Date.now(),
          message: "Please wait",
          error: "please wait and try again",
        });
      } else {
        req.session.attempt = 1;
        req.session.time = Date.now();
      }
    } else {
      req.session.attempt = req.session.attempt ? req.session.attempt + 1 : 1;
    }

    const isMatch = await bcrypt.compare(password, identified.doc.password);
    if (!isMatch) return res.send({ error: "Cannot match password" });

    req.session.superValidity = Date.now();
    const accessToken = jwt.sign(
      { userId: identified.doc._id, time: Date.now() },
      process.env.JWT_SECRET!
    ) as string;

    const updatedToken = await User.findByIdAndUpdate(
      identified.doc._id,
      {
        accessToken,
      },
      { new: true }
    );
    if (updatedToken) {
      res.cookie("rebybfund", accessToken).send({
        message: "Login successful",
        redirect: "/myaccount",
        success: true,
        myDetails: await account(updatedToken),
      });
    } else return res.send({ error: "Login failed" });
  } catch (e) {
    console.log(`Login post error: ${e}`);
    res.status(500).send("Internal Server Error");
  }
};

const loginSendOtp = async (req: Request, res: Response) => {
  try {
    const { identifyId }: { identifyId: string } = req.body;

    if (typeof identifyId !== "string")
      return res.send({ error: "Invalid identifyId!" });
    if (identifyId === "")
      return res.send({ error: "please fill out the identifyId!" });

    const identified = await identificationService(identifyId);
    if (identified.error) return res.send(identified);

    let msg = "";
    let sentOn: number | string = "";
    switch (identified.type) {
      case "contact":
        msg = "This contact number is not registered";
        sentOn = identified?.contact || "";
        break;
      case "email":
        msg = "This email id is not registered";
        sentOn = identified?.email || "";
        break;
      case "id":
        msg = "This _id of user not found";
        break;
      case "referCode":
        msg = "This referCode of user not found";
        break;
      default:
        // code
        break;
    }

    if (!identified.doc) return res.send({ error: msg });

    if (!req.session.time || req.session.time + 1000 * 60 * 2 < Date.now()) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      req.session.otp = otp.toString();
      req.session.time = Date.now();
      req.session.attempt = 1;
      req.session.userId = identified.doc._id;

      if (
        identified.type === "id" ||
        identified.type === "referCode" ||
        identified.type === "contact"
      ) {
        if (identified.doc) {
          const contactNumber = identified.doc.contact;
          sentOn = "*****" + String(contactNumber).substring(5);
        }

        //TO DO send otp on contact

        return res.send({
          message: "OTP Sent on " + sentOn,
          otp,
          success: true,
          btn: "Verify & Login",
        });
      }

      if (identified.email) {
        //TODO send otp on email
        // await SendMail(identified.email, "Verification And Login", String(otp));
        return res.send({
          message: "OTP Sent on " + identified.doc.email,
          otp,
          success: true,
          btn: "Verify & Login",
        });
      }
    } else {
      return res.send({
        wait: req.session.time + 1000 * 60 * 2 - Date.now(),
        message: "Please wait",
        error: "Please wait and try again",
      });
    }
  } catch (e) {
    console.log(`Login send OTP error: ${e}`);
    res.status(500).send("Internal Server Error");
  }
};

const loginVerifyOtp = async (req: Request, res: Response) => {
  try {
    const { otp }: { otp: number } = req.body;
    console.log(typeof otp, { otp });

    if (typeof otp !== "string") return res.send({ error: "invalid OTP" });
    if (!otp || otp == "") return res.send({ error: "Please Enter your OTP" });

    if (!req.session.otp) return res.send({ error: "First send OTP" });

    if (req.session.attempt && req.session.attempt > 11) {
      if (req.session.time && req.session.time + 1000 * 60 * 2 < Date.now()) {
        req.session.attempt = 1;
        req.session.time = Date.now();
      } else {
        return res.send({
          wait: req.session.time + 1000 * 60 * 2 - Date.now(),
          message: "Please wait",
          error: "Please wait and try again",
        });
      }
    }

    if (req.session.time + 1000 * 60 * 2 < Date.now()) {
      return res.send({ error: "Your OTP has expired" });
    }

    if (otp !== req.session.otp) {
      req.session.attempt = req.session.attempt ? req.session.attempt + 1 : 1;
      return res.send({ error: "Cannot match OTP" });
    }

    req.session.superValidity = Date.now();
    const accessToken = jwt.sign(
      { userId: req.session.userId, time: Date.now() },
      process.env.JWT_SECRET!
    );

    const updatedToken = await User.findByIdAndUpdate(
      req.session.userId,
      {
        accessToken,
      },
      { new: true }
    );
    if (updatedToken) {
      res.cookie("rebybfund", accessToken).send({
        message: "Login successful",
        redirect: "/myaccount",
        success: true,
        myDetails: await account(updatedToken),
      });
    } else return res.send({ error: "Login failed" });
  } catch (e) {
    console.log(`Login verify OTP error: ${e}`);
    res.status(500).send("Internal Server Error");
  }
};

export { loginPost, login, loginSendOtp, loginVerifyOtp };
