import User from "../models/UsersSchema";
import { Request, Response } from "express";

const logout = async (req: Request, res: Response) => {
  try {
    const userToken = req.cookies.rebybfund;

    // Clear the cookie
    res
      .clearCookie("rebybfund")
      .send({ redirect: "/login", message: "Logout successful" });

    // Update accessToken to empty string in User schema
    const clearedAccessToken = await User.updateOne(
      { accessToken: userToken }, // Query to find the user by accessToken
      { accessToken: "" }, // Update accessToken to empty string
      { new: true } // Options to return the updated document
    );

    console.log(clearedAccessToken);
  } catch (e) {
    console.log(e);
  }
};

export default logout;
