import express from "express";
import { updateUser } from "../controllers/updateUser"; // Assuming updateUser is a function
import UserAuthenticate from "../middleware/UserAuthenticate";

const updateUserRouter = express.Router();

updateUserRouter
  .route("/update-user-details")
  .post(UserAuthenticate, updateUser);

export default updateUserRouter;
