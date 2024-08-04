import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken"; // Explicit import for clarity
import User, { IUser } from "../models/UsersSchema"; // Assuming an interface for User
import { ObjectId } from "mongoose";
import { IToken } from "../types";

interface IReq extends Request {
  token?: string;
  rootUser?: IUser;
  userId?: ObjectId;
}

require("dotenv").config();

const UserAuthenticate = async (
  req: IReq,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies?.rebybfund) {
      return res.send({
        redirect: "/login",
        error: "Unauthorised: no token provided",
      });
    }

    const userToken = req.cookies.rebybfund;

    // Type assertion for JWT_SECRET (assuming it's a string in .env)
    const verifyToken = verify(
      userToken,
      process.env.JWT_SECRET as string
    ) as IToken;

    const rootUser = await User.findById(verifyToken.userId).select(
      "-expenses -incomes"
    );
    if (rootUser) {
      // console.log({ rootUser });

      req.token = userToken;
      req.rootUser = rootUser;
      req.userId = rootUser._id; // Handle potential undefined _id
      next();
    } else {
      return res
        .clearCookie("rebybfund")
        .status(401)
        .send({ redirect: "/login", error: "Invalid cookie token" });
    }
  } catch (e) {
    console.log(e);
    res
      .status(401)
      .send({ redirect: "/login", error: "Invalid token provided" });
  }
};

export default UserAuthenticate;
