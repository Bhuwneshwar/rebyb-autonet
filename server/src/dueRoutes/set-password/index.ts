import express, { Response } from "express";
import UserAuthenticate from "../../middleware/UserAuthenticate";
import { IReq } from "../../types";
import bcrypt from "bcryptjs";
import User, { IUser } from "../../models/UsersSchema";
import SendMail from "../../controllers/SendMail";

const verifyOtp = async (req: IReq, res: Response) => {
  try {
    if (!req.rootUser)
      return res.json({ error: "please login", redirect: "/login" });

    const { otp, verifyReason } = req.body;
    if (typeof otp !== "string") return res.send({ error: "otp not a string" });
    if (otp === "") return res.send({ error: "otp is required" });
    if (otp.length !== 6) return res.send({ error: "otp should be 6 digits" });

    if (typeof verifyReason !== "string")
      return res.send({ error: "verifyReason not a string" });
    if (verifyReason === "")
      return res.send({ error: "verifyReason is required" });

    const storedOtp = req.rootUser.otpWork.otp;
    const storedExpiredAt = req.rootUser.otpWork.otpExpiredAt;
    const attempt = req.rootUser.otpWork.attempt;

    console.log({ attempt });

    if (storedExpiredAt) {
      const valid = new Date(storedExpiredAt) > new Date();
      if (!valid) {
        return res.send({
          error: "OTP has expired please try again",
        });
      }

      if (otp === storedOtp) {
        await User.findByIdAndUpdate(req.userId, {
          $set: {
            otpWork: {
              otp: undefined,
              otpExpiredAt: undefined,
              attempt: 0,
              verifiedReason: verifyReason,
              otpValidity: new Date(Date.now() + 1000 * 60 * 2),
            },
          },
        });
        return res.send({ success: true, otpVerified: true });
      } else {
        if (attempt && attempt < 10) {
          await User.findByIdAndUpdate(req.userId, {
            $set: {
              otpWork: {
                $inc: {
                  attempt: 1,
                },
              },
            },
          });
        } else {
          return res.send({
            error: "You have reached maximum attempt limit",
            wait: new Date(storedExpiredAt).getTime() - Date.now(),
          });
        }

        return res.send({ error: "OTP does not match" });
      }
    } else return res.send({ error: "please first send OTP" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const sendOtp = async (req: IReq, res: Response) => {
  try {
    if (!req.rootUser)
      return res.json({ error: "please login", redirect: "/login" });

    const storedOtp = req.rootUser.otpWork.otp;
    const storedExpiredAt = req.rootUser.otpWork.otpExpiredAt;

    console.log({ storedOtp, storedExpiredAt });

    if (storedExpiredAt) {
      const valid = new Date(storedExpiredAt) > new Date();
      if (valid) {
        return res.send({
          wait: new Date(storedExpiredAt).getTime() - Date.now(),
          message: "Please wait",
          error: "Please wait and try again",
        });
      }
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await User.findByIdAndUpdate(req.userId, {
      $set: {
        otpWork: {
          otp: otp,
          otpExpiredAt: new Date(Date.now() + 1000 * 60 * 2),
          attempt: 1,
        },
      },
    });

    //  TODO send otp on contact
    await SendMail(req.rootUser.email, "Modifiy Password", otp, otp);
    return res.send({
      message: "OTP Sent on email and contact successfully",
      otp,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const changePassword = async (req: IReq, res: Response) => {
  try {
    if (!req.rootUser) return res.send({ error: "please login" });
    console.log({ ...req.body });
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const db_password = req.rootUser?.password;

    if (!db_password)
      return res.json({
        error: "You should set your password at '/api/set-password'",
      });

    if (typeof newPassword !== "string")
      return res.send({ error: "new password must be a string" });
    if (newPassword === "")
      return res.send({ error: "new password is required" });
    if (newPassword.length < 4 || newPassword.length > 30)
      return res.send({ error: "new password should length between 4-30!" });

    if (typeof confirmPassword !== "string")
      return res.send({ error: "confirm password must be a string" });
    if (confirmPassword === "")
      return res.send({ error: "confirm password is required" });
    if (confirmPassword !== newPassword)
      return res.send({
        error: "confirm password should match with new password",
      });

    const IsMatch = await bcrypt.compare(oldPassword, db_password);

    if (!IsMatch) return res.json({ error: "Cannot match old password" });

    const hashed_password = await bcrypt.hash(newPassword, 12);
    console.log({ hashed_password });

    const setPass = await User.findByIdAndUpdate(
      req.userId,
      { password: hashed_password },
      { new: true }
    );
    console.log({ setPass });
    return res.json({
      success: true,

      message: "Your password has been changed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const changeBalancePin = async (req: IReq, res: Response) => {
  try {
    if (!req.rootUser) return res.send({ error: "please login" });
    console.log({ ...req.body });
    const { oldBalancePin, newBalancePin, confirmBalancePin } = req.body;
    const dbBalancePin = req.rootUser?.BalanceAccessPin;

    if (!dbBalancePin)
      return res.json({
        error: "You should set your balance pin using OTP.",
      });

    if (typeof newBalancePin !== "string")
      return res.send({ error: "new balance pin must be a string" });
    if (newBalancePin === "")
      return res.send({ error: "new balance pin is required" });
    if (newBalancePin.length !== 6)
      return res.send({
        error: "new balance pin should 6 digits!",
      });
    if (!/^[\d]{6}$/.test(newBalancePin))
      return res.send({
        error: "new balance pin allow only number keys!",
      });

    if (typeof confirmBalancePin !== "string")
      return res.send({ error: "confirm balance pin must be a string" });
    if (confirmBalancePin === "")
      return res.send({ error: "confirm balance pin is required" });
    if (confirmBalancePin !== newBalancePin)
      return res.send({
        error: "confirm balance pin should match with new balance pin",
      });

    const IsMatch = await bcrypt.compare(oldBalancePin, dbBalancePin);

    if (!IsMatch) return res.json({ error: "Cannot match old Balance PIN" });

    const hashed_password = await bcrypt.hash(newBalancePin, 12);
    console.log({ hashed_password });

    const setPass = await User.findByIdAndUpdate(
      req.userId,
      { BalanceAccessPin: hashed_password },
      { new: true }
    );
    console.log({ setPass });
    return res.json({
      success: true,
      message: "Your Balance PIN has been changed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const setPassword = async (req: IReq, res: Response) => {
  try {
    if (!req.rootUser)
      return res.json({ error: "please login", redirect: "/login" });

    const { newPassword, confirmPassword, verifyReason } = req.body;

    if (typeof newPassword !== "string")
      return res.send({ error: "new password must be a string" });
    if (newPassword === "")
      return res.send({ error: "new password is required" });
    if (newPassword.length < 4 || newPassword.length > 30)
      return res.send({ error: "new password should length between 4-30!" });

    if (typeof confirmPassword !== "string")
      return res.send({ error: "confirm password must be a string" });
    if (confirmPassword === "")
      return res.send({ error: "confirm password is required" });
    if (confirmPassword !== newPassword)
      return res.send({
        error: "confirm password should match with new password",
      });

    if (typeof verifyReason !== "string")
      return res.send({ error: "verify reason must be a string" });
    if (verifyReason === "")
      return res.send({ error: "verify reason is required" });

    const { verifiedReason, otpValidity: otpValidity } = req.rootUser.otpWork;

    if (
      verifiedReason === verifyReason &&
      otpValidity &&
      new Date(otpValidity) > new Date()
    ) {
      //DO DO ADD SALT IN CRYPTO TO
      const hashed_password = await bcrypt.hash(newPassword, 12);
      await User.findByIdAndUpdate(
        req.userId,
        { password: hashed_password },
        { new: true }
      );
      return res.send({
        password: true,
        success: true,
        message: "Your password has been set",
      });
    } else {
      return res.json({ error: "OTP was valid only for 2 minutes" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const setBalancePin = async (req: IReq, res: Response) => {
  try {
    if (!req.rootUser)
      return res.json({ error: "please login", redirect: "/login" });
    console.log(req.body);

    const { newBalancePin, confirmBalancePin, verifyReason } = req.body;

    if (typeof newBalancePin !== "string")
      return res.send({ error: "new balance pin must be a string" });
    if (newBalancePin === "")
      return res.send({ error: "new balance pin is required" });
    if (newBalancePin.length !== 6)
      return res.send({
        error: "new balance pin should 6 digits!",
      });
    if (!/^[\d]{6}$/.test(newBalancePin))
      return res.send({
        error: "new balance pin allow only number keys!",
      });

    if (typeof confirmBalancePin !== "string")
      return res.send({ error: "confirm balance pin must be a string" });
    if (confirmBalancePin === "")
      return res.send({ error: "confirm balance pin is required" });
    if (confirmBalancePin !== newBalancePin)
      return res.send({
        error: "confirm balance pin should match with new balance pin",
      });

    if (typeof verifyReason !== "string")
      return res.send({ error: "verify reason must be a string" });
    if (verifyReason === "")
      return res.send({ error: "verify reason is required" });

    const { verifiedReason, otpValidity } = req.rootUser.otpWork;

    if (
      verifiedReason === verifyReason &&
      otpValidity &&
      new Date(otpValidity) > new Date()
    ) {
      //DO DO ADD SALT IN CRYPTO TO
      const hashed_balancePin = await bcrypt.hash(newBalancePin, 12);
      await User.findByIdAndUpdate(
        req.userId,
        { BalanceAccessPin: hashed_balancePin },
        { new: true }
      );
      return res.send({
        BalancePin: true,
        success: true,
        message: "Your BalancePin has been set",
      });
    } else {
      return res.json({ error: "OTP was valid only for 2 minutes" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const setPasswordRoute = express.Router();
setPasswordRoute.route("/send-otp").get(UserAuthenticate, sendOtp);
setPasswordRoute.route("/account/verify-otp").post(UserAuthenticate, verifyOtp);
setPasswordRoute.route("/set-password").post(UserAuthenticate, setPassword);
setPasswordRoute
  .route("/set-balance-pin")
  .post(UserAuthenticate, setBalancePin);
setPasswordRoute
  .route("/change-balance-pin")
  .post(UserAuthenticate, changeBalancePin);
setPasswordRoute
  .route("/change-password")
  .post(UserAuthenticate, changePassword);
export default setPasswordRoute;
