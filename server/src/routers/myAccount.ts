import express from "express";

import {
  // changePassword,
  sendMoney,
  topUp,
  withdraw,
  // setPassword,
  accountPaymentVerification,
  recharge,
  invest,
  setReferCode,
  genReferCode,
  addFundsPaymentVerification,
  accountPaymentVerificationSendMoney,
  verifyBalanceAccessPin,
} from "../controllers/Account"; // Assuming controllers export functions
import {} from "../controllers/Account";
import {
  checkOtherFunds,
  addOtherFunds,
  sendMessage,
  getMessages,
  join,
  addOthersPaymentVerification,
} from "../controllers/OthersFunds"; // Assuming controllers export functions
import UserAuthenticate from "../middleware/UserAuthenticate";
import allMessages from "../controllers/allMessages";

const myAccountRoute = express.Router();

// myAccountRoute.route("/change-password").post(UserAuthenticate, changePassword);
// myAccountRoute.route("/set-password").post(UserAuthenticate, setPassword);
myAccountRoute.route("/account-send-money").post(UserAuthenticate, sendMoney);
//
myAccountRoute.route("/recharge").post(UserAuthenticate, recharge);
myAccountRoute.route("/withdraw").post(UserAuthenticate, withdraw);
myAccountRoute.route("/top-up").post(UserAuthenticate, topUp);
myAccountRoute.route("/invest").post(UserAuthenticate, invest);
myAccountRoute
  .route("/verify/balance-access-pin")
  .post(UserAuthenticate, verifyBalanceAccessPin);
//
myAccountRoute
  .route("/account-refer")
  .post(UserAuthenticate, setReferCode)
  .get(UserAuthenticate, genReferCode);
myAccountRoute
  .route("/account/payment/verification")
  .post(UserAuthenticate, accountPaymentVerification);
myAccountRoute
  .route("/account/payment/verification/sendMoney")
  .post(UserAuthenticate, accountPaymentVerificationSendMoney);
myAccountRoute
  .route("/account/payment/verification/add/funds")
  .post(UserAuthenticate, addFundsPaymentVerification);
myAccountRoute
  .route("/account/payment/verification/add/others/funds")
  .post(UserAuthenticate, addOthersPaymentVerification);

myAccountRoute
  .route("/other-check-funds/:identifier")
  .get(UserAuthenticate, checkOtherFunds);
myAccountRoute.route("/add-other-funds").post(UserAuthenticate, addOtherFunds);
// myAccountRoute.route("/messages").get(UserAuthenticate, allMessages);
myAccountRoute.route("/message-send").post(UserAuthenticate, sendMessage);
myAccountRoute.route("/message/join").post(UserAuthenticate, join);
myAccountRoute
  .route("/messages/:referCode?")
  .get(UserAuthenticate, getMessages);

export default myAccountRoute;
