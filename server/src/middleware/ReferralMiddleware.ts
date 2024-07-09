import { Request, Response, NextFunction } from "express";
import User from "../models/UsersSchema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IReq } from "../types";

dotenv.config();

const ReferralMiddleware = async (
  req: IReq,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req?.cookies?.rebybfund) {
      const userToken = req.cookies.rebybfund;
      const verifyToken = jwt.verify(
        userToken,
        process.env.JWT_SECRET as string
      ) as { userId: string };

      const rootUser = await User.findById(verifyToken.userId);
      if (!rootUser) throw new Error("Invalid cookie token");

      req.token = userToken;
      req.rootUser = rootUser;
      req.userId = rootUser._id;
    }
    next();
  } catch (e) {
    console.log(e);
    res
      .status(401)
      .send({ redirect: "/login", message: "Invalid token provided" });
  }
};

export default ReferralMiddleware;
