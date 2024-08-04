import { Request, Response } from "express";
import User from "../models/UsersSchema"; // Update this import according to your actual User model file
import SendMail from "./SendMail";
import { IReq } from "../types";

const phoneOtpSend = async (req: IReq, res: Response) => {
  try {
    console.log(req.body);

    const { contact } = req.body;
    const contactRegex = /([5-9]{1}[0-9]{9})$/g;
    let mob: string;
    if (typeof contact === "string") {
      if (contactRegex.test(contact)) {
        const extracted = contact.match(contactRegex);
        if (extracted?.length) {
          mob = extracted[0];
          if (!mob) return res.send({ error: "Could not find mobile contact" });
        } else return res.send({ error: "Could not find contact" });
      } else return res.send({ error: "Could not find contact" });
    } else {
      res.send({ error: "invalid contact number " });
      return;
    }

    const alreadyContact = await User.findOne({
      contact: mob,
      userType: "permanent",
    });
    if (alreadyContact) {
      console.log(alreadyContact);
      res.send({ error: "this contact number already registered " });
      return;
    }

    if (req.session.time) {
      const dueTime = Date.now() - req.session.time;
      if (dueTime < 2 * 60000) {
        res.send({
          status: false,
          message: "please wait",
          dueTimeMs: 2 * 60000 - dueTime,
        });
        return;
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    req.session.otp = otp.toString();
    req.session.time = Date.now();
    req.session.count = 0;
    req.session.contact = mob;
    console.log(otp);
    res.send({
      success: true,
      contact: mob,
      message: "OTP Sent Successfully.",
      otp,
    });
  } catch (error) {
    console.log("Failed to send", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const phoneOtpVerify = async (req: IReq, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    console.log(req.session);

    const { contact, userOtp, verifyReason } = req.body;
    const { count } = req.session;

    if (contact != req.session.contact) {
      res.send({ error: "Contact number can't matching" });
      return;
    }

    const dueTime = Date.now() - req.session.time;
    req.session.count = count + 1;

    if (count > 9) {
      res.send({ error: "please send again" });
      return;
    }
    if (!req.session.otp || dueTime > 2 * 60000) {
      res.send({ error: "Expired your OTP please send again" });
      return;
    }

    if (userOtp == req.session.otp) {
      if (req.session.contact == req.session.phoneVerified) {
        req.session.phoneVerified = req.session.contact;
        req.session.phoneVerifiedTime = Date.now();
        res.send({ warning: "Already Verified" });
        return;
      }
      req.session.phoneVerified = req.session.contact;
      req.session.phoneVerifiedTime = Date.now();
      if (verifyReason === "updateContact") {
        if (!req.userId) {
          res.send({ error: "cookie token is invalid" });
          return;
        }
        const updatedContact = await User.findByIdAndUpdate(
          req.userId,
          { contact: req.session.phoneVerified },
          { new: true }
        );

        if (!updatedContact) {
          res.send({ error: "can't update contact" });
          return;
        }
        req.session.phoneVerified = undefined;
        req.session.phoneVerifiedTime = undefined;
        res.send({
          success: true,
          verifiedContact: req.session.contact,
          message: "contact updated successfully.",
        });
        return;
      }
      res.send({ success: true, status: true, message: `OTP Verified` });
    } else {
      res.send({ status: false, error: `OTP Verification failed!` });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const emailOtpSend = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    const { email } = req.body;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;

    if (!emailRegex.test(email)) {
      res.send({ error: "invalid email" });
      return;
    }

    const alreadyEmail = await User.findOne({ email, userType: "permanent" });
    if (alreadyEmail) {
      res.send({ error: "this email id already registered!" });
      return;
    }

    if (req.session.timeEmail) {
      const dueTime = Date.now() - req.session.timeEmail;
      if (dueTime < 2 * 60000) {
        res.send({
          status: true,
          warning: "please wait",
          dueTimeMs: 2 * 60000 - dueTime,
        });
        return;
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    req.session.otpEmail = otp.toString();
    req.session.timeEmail = Date.now();
    req.session.countEmail = 0;
    req.session.email = email;
    await SendMail(email, "Verification", "test email", `<h1>${otp}</h1>`);
    console.log(otp);
    res.send({
      success: true,
      message: "OTP Sent Successfully.",
      otp,
      status: true,
    });
  } catch (error) {
    console.log("email otp send", { error });
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const emailOtpVerify = async (req: IReq, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    console.log(req.session);

    const { email, userOtp, verifyReason } = req.body;
    const { countEmail } = req.session;

    if (email != req.session.email) {
      res.send({ error: "Email id can't matching" });
      return;
    }

    const dueTime = Date.now() - req.session.timeEmail;

    req.session.countEmail = countEmail + 1;
    if (countEmail > 9) {
      res.send({ error: "please send again" });
      return;
    }

    if (!req.session.otpEmail || dueTime > 2 * 60000) {
      res.send({ error: "Expired your OTP please send again" });
      return;
    }

    if (userOtp == req.session.otpEmail) {
      if (req.session.email == req.session.emailVerified) {
        req.session.emailVerified = req.session.email;
        req.session.emailVerifiedTime = Date.now();
        res.send({ error: "Already Verified" });
        return;
      }
      req.session.emailVerifiedTime = Date.now();
      req.session.emailVerified = req.session.email;

      if (verifyReason === "updateEmail") {
        if (!req.userId) {
          res.send({ error: "cookie token is invalid" });
          return;
        }
        const updatedContact = await User.findByIdAndUpdate(
          req.userId,
          { email: req.session.emailVerified },
          { new: true }
        );

        if (!updatedContact) {
          res.send({ error: "can't update email" });
          return;
        }
        req.session.emailVerified = undefined;
        req.session.emailVerifiedTime = undefined;
        res.send({
          success: true,
          verifiedContact: req.session.email,
          message: "Email updated successfully.",
        });
        return;
      }
      res.send({ success: true, status: true, message: `OTP Verified` });
    } else {
      res.send({ status: false, error: `OTP Verification failed!` });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export { phoneOtpSend, phoneOtpVerify, emailOtpSend, emailOtpVerify };
