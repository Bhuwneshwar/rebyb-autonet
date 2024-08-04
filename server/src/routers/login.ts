import express from "express";
const loginRouter = express.Router();

import {
  login,
  loginPost,
  loginSendOtp,
  loginVerifyOtp,
} from "../controllers/login"; // Assuming controllers export functions
import UserAuthenticate from "../middleware/UserAuthenticate";
import logout from "../controllers/logout";
import { admin, adminWork } from "../controllers/admin"; // Assuming controllers export functions
import { myAccount } from "../controllers/myAccount";

loginRouter.route("/login").post(loginPost).get(login);
loginRouter.route("/send-otp").post(loginSendOtp);
loginRouter.route("/verify-otp").post(loginVerifyOtp);
loginRouter.route("/myaccount").get(UserAuthenticate, myAccount); // Assuming myAccount is a function
loginRouter.route("/logout").get(logout);

loginRouter.route("/admin").get(admin); // Assuming admin is a function with appropriate permissions check
loginRouter.route("/admin-work").get(adminWork); // Assuming adminWork is a function with appropriate permissions check

export default loginRouter;
