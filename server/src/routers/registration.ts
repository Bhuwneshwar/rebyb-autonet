import express from "express";
const router = express.Router();

import {
  registration,
  registrationPost,
  checkNumber,
} from "../controllers/registration"; // Assuming controllers export functions
import paymentVerification from "../middleware/payment";
import UserAuthenticate from "../middleware/UserAuthenticate";

import ReferralMiddleware from "../middleware/ReferralMiddleware";
import {
  phoneOtpSend,
  phoneOtpVerify,
  emailOtpSend,
  emailOtpVerify,
} from "../controllers/OTP"; // Assuming controllers export functions
import generateCertificate from "../middleware/GenerateAuto-Net-card";
import cookieTokenVerifyOptional from "../middleware/cookieTokenVerifyOptional";

router.route("/registration").get(registration).post(registrationPost);
router.route("/check/number/").get(checkNumber);
router
  .route("/payment/verification")
  .post(ReferralMiddleware, paymentVerification);
router
  .route("/email/otp/verify")
  .post(cookieTokenVerifyOptional, emailOtpVerify);
router
  .route("/phone/otp/verify")
  .post(cookieTokenVerifyOptional, phoneOtpVerify);
router.route("/phone/otp/send").post(cookieTokenVerifyOptional, phoneOtpSend);
router.route("/email/otp/send").post(cookieTokenVerifyOptional, emailOtpSend);
// router.route('/pdf/download').get(generateCertificate); // Commented out
router.route("/pdf/:identifyId").get(generateCertificate); // Assuming name is a string parameter

export default router;
