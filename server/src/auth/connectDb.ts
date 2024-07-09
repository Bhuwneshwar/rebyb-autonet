import dotenv from "dotenv";
import mongoose from "mongoose";
// import { AutoRegistration } from "../controllers/forMockData/AutoRegistration";
// import { ResetFunds } from "../controllers/forMockData/resetFunds";

dotenv.config();

const connectDB = async (): Promise<boolean> => {
  try {
    const data = await mongoose.connect(process.env.DB_URL as string, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`Mongodb connected with server: ${data.connection.host}`);

    return true;
  } catch (e) {
    console.log("No Internet Connection : \n" + e);
    return false;
  }
};

export default connectDB;
