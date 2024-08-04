import mongoose from "mongoose";
import { IUser, userSchema } from "./UsersSchema";

const TempUser = mongoose.model<IUser>("TempUser", userSchema);
export default TempUser;
