import { Request, Response, NextFunction } from "express";
import catchAsyncErrors from "./catchAsyncErrors";
import jwt from "jsonwebtoken";
import User from "../models/UsersSchema";
import { ErrorHandler } from "./error";

interface DecodedToken {
  id: string;
}

interface AuthRequest extends Request {
  user?: any; // Assuming User model type or interface
}

export const isAuthenticatedUser = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401)
      );
    }

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    req.user = await User.findById(decodedData.id);

    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
