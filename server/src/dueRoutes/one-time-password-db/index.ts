import express, { Response } from "express";
import UserAuthenticate from "../../middleware/UserAuthenticate";
import { IReq } from "../../types";
const sendOtpPhone = async (req: IReq, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "client error" });
  }
};
const verifyOtpPhone = async () => {};
const sendOtpEmail = async () => {};
const verifyOtpEmail = async () => {};
const oneTimePasswordDbRoute = express.Router();
oneTimePasswordDbRoute
  .route("/send-otp-phone")
  .post(UserAuthenticate, sendOtpPhone);
oneTimePasswordDbRoute
  .route("/verify-otp-phone")
  .post(UserAuthenticate, verifyOtpPhone);
oneTimePasswordDbRoute
  .route("/send-otp-email")
  .post(UserAuthenticate, sendOtpEmail);
oneTimePasswordDbRoute
  .route("/verify-otp-email")
  .post(UserAuthenticate, verifyOtpEmail);
export default oneTimePasswordDbRoute;
