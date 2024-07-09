import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/UsersSchema";
import { IReq } from "../types";

dotenv.config();

const cookieTokenVerifyOptional = async (
  req: IReq,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.cookies?.rebybfund) {
      const userToken = req.cookies.rebybfund;
      const verifyToken = jwt.verify(
        userToken,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      const rootUser = await User.findById(verifyToken.userId);

      console.log({ rootUser });

      if (rootUser) {
        req.token = userToken;
        req.rootUser = rootUser;
        req.userId = rootUser._id;
      }
    }
    next();
  } catch (error) {
    console.log({ message: (error as Error).message });
    res
      .status(401)
      .send({ redirect: "/login", error: (error as Error).message });
  }
};

export default cookieTokenVerifyOptional;
