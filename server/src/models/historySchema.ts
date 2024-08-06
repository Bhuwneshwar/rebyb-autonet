import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface HistoryModel extends Document {
  category: "income" | "expense";
  subcategory: string;
  amount: number;
  date: Date;
  userId: ObjectId;
  golden: number;
  diamond: number;
  id: ObjectId;
  name: string;

  phone: string;
  plan: number;
  validity: number;
  from: string; //"balance or bank"
  createdAt: Date;
  updatedAt: Date;
  _id: ObjectId;

  // incomes: {
  //   referralAmount: {
  //     amount: number;
  //     golden: number;
  //     diamond: number;
  //     id: ObjectId;
  //     name: string;
  //     date: Date;
  //     userId: ObjectId;
  //   }[];
  //   topUpAmount: {
  //     amount: number;
  //     date: Date;
  //     userId: ObjectId;
  //   }[];
  //   userAmount: {
  //     amount: number;
  //     date: Date;
  //     id: ObjectId;
  //     name: string;
  //     userId: ObjectId;
  //   }[];
  // };

  // expenses: {
  //   recharge: {
  //     phone: string;
  //     plan: number;
  //     validity: number;
  //     date: Date;
  //     from: string; //"balance or bank"
  //     userId: ObjectId;
  //   }[];
  //   userSend: {
  //     id: ObjectId;
  //     name: string;
  //     amount: number;
  //     date: Date;
  //     from: string;
  //     userId: ObjectId;
  //   }[];
  //   withdrawOnBank: {
  //     amount: number;
  //     date: Date;
  //     userId: ObjectId;
  //   }[];
  //   invest: {
  //     golden: number;
  //     diamond: number;
  //     amount: number;
  //     from: string;
  //     date: Date;
  //     userId: ObjectId;
  //   }[];
  // };
  // createdAt: Date;
  // updatedAt: Date;
}

const historySchema: Schema<HistoryModel> = new Schema(
  {
    // incomes: {
    //   referralAmount: [
    //     {
    category: { type: String, enum: ["income", "expense"] },
    subcategory: {
      type: String,
      // enum: ["referralAmount", "invest", "topUp", "userAmount"],
    },
    amount: Number,
    golden: Number,
    diamond: Number,
    id: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    date: Date,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    //   },
    // ],
    // topUpAmount: [
    //   {
    // amount: Number,
    // date: Date,
    // userId: { type: Schema.Types.ObjectId, ref: "User" },
    //   },
    // ],
    // userAmount: [
    //   {
    // amount: Number,
    // date: Date,
    // id: { type: Schema.Types.ObjectId, ref: "User" },
    // name: String,
    // userId: { type: Schema.Types.ObjectId, ref: "User" },
    //     },
    //   ],
    // },
    // expenses: {
    //   recharge: [
    //     {
    phone: String,
    plan: Number,
    validity: Number,
    // date: Date,
    from: String,
    // userId: { type: Schema.Types.ObjectId, ref: "User" },
    //   },
    // ],
    // userSend: [
    //   {
    // id: { type: Schema.Types.ObjectId, ref: "User" },
    // name: String,
    // amount: Number,
    // date: Date,
    // from: String,
    // userId: { type: Schema.Types.ObjectId, ref: "User" },
    //   },
    // ],
    // withdrawOnBank: [
    //   {
    // amount: Number,
    // date: Date,
    // userId: { type: Schema.Types.ObjectId, ref: "User" },
    //   },
    // ],
    // invest: [
    //   {
    // golden: Number,
    // diamond: Number,
    // amount: Number,
    // from: String,
    // date: Date,
    // userId: { type: Schema.Types.ObjectId, ref: "User" },
    //     },
    //   ],
    // },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model<HistoryModel>(
  "TransactionHistory",
  historySchema
);

export default Transaction;
