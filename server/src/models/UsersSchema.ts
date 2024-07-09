import mongoose from "mongoose";

export interface Recharge {
  operator: string;
  state: string;
  validity: number;
  number: string;
  plan: string;
  rechargedAt: Date;
}

interface Income {
  amount: number;
  time: Date;
  from: string;
}

interface ExpenseRecharge {
  contact: number;
  amount: number;
  validity: number;
  time: Date;
}

interface ExpenseUserSend {
  time: Date;
  to: string;
  from: string;
  amount: number;
}

interface ExpenseWithdrawOnBank {
  time: Date;
  to: string;
  amount: number;
}

interface IncomeDetails {
  referralAmount: Income[];
  topupAmount: Income[];
  userAmount: Income[];
}

interface ExpenseDetails {
  recharge: ExpenseRecharge[];
  userSend: ExpenseUserSend[];
  withdrawOnBank: ExpenseWithdrawOnBank[];
}

interface UserPriority {
  no_1: string;
  no_2: string;
  no_3: string;
}

export interface IUser {
  _id: mongoose.ObjectId;
  name: string;
  coverImg?: string; // Optional property
  role: string;
  profileImg?: string; // Optional property
  age: number;
  gender: string;
  contact: number;
  email: string;

  autoRecharge: boolean;
  autoWithdraw: boolean;
  NextInvest: boolean;
  rechargeNum1?: Recharge; // Optional property
  rechargeNum2?: Recharge; // Optional property
  rechargeNum3?: Recharge; // Optional property

  transactionMethod?: string; // Optional property
  upi?: string; // Optional property
  ifsc?: string; // Optional property
  bank?: string; // Optional property

  password: string;
  accessToken: string;

  RegisteredAt: Date;
  Balance: number;
  updatedDate: Date;
  incomes: IncomeDetails;
  expenses: ExpenseDetails;
  referCode: string;
  withdrawPerc: number;
  Priority: UserPriority;
  nextInvestCountG: number;
  nextInvestCountD: number;
  nextInvestForMoney: number;
  userType: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [60, "Name cannot exceed 60 characters"],
      minLength: [3, "Name must be at least 3 characters"],
    },
    coverImg: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user", "fundraiser", "employee", "manager"],
      default: "user",
    },
    profileImg: {
      type: String,
    },
    age: {
      type: Number,
      required: true,
      min: 10,
      max: 99,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    contact: {
      type: Number,
      unique: true,
      required: true,
      maxLength: 10,
      minLength: 10,
    },
    email: { type: String, unique: true, required: true },

    autoRecharge: {
      type: Boolean,
      required: true,
      default: false,
    },
    autoWithdraw: {
      type: Boolean,
      required: true,
      default: false,
    },
    NextInvest: {
      type: Boolean,
      required: true,
      default: false,
    },
    rechargeNum1: {
      type: mongoose.Schema.Types.Mixed, // Allow flexibility for optional recharge data
    },
    rechargeNum2: {
      type: mongoose.Schema.Types.Mixed,
    },
    rechargeNum3: {
      type: mongoose.Schema.Types.Mixed,
    },

    transactionMethod: {
      type: String,
    },
    upi: {
      type: String,
    },
    ifsc: {
      type: String,
    },
    bank: {
      type: String,
    },

    password: {
      password: String,
      accessToken: String,

      RegisteredAt: {
        type: Date,
        default: Date.now,
      },
      Balance: {
        type: Number,
        default: 0,
      },
      updatedDate: {
        type: Date,
        default: Date.now(),
      },
      incomes: {
        referralAmount: [
          {
            amount: Number,
            time: { type: Date, default: Date.now() },
            from: String,
          },
        ],
        topupAmount: [
          {
            amount: Number,
            time: { type: Date, default: Date.now() },
            from: String,
          },
        ],
        userAmount: [
          {
            amount: Number,
            time: { type: Date, default: Date.now() },
            from: String,
          },
        ],
      },

      expenses: {
        recharge: [
          {
            contact: Number,
            amount: Number,
            validity: { type: Number, default: 0 },
            time: { type: Date, default: Date.now() },
          },
        ],
        userSend: [
          {
            time: { type: Date, default: Date.now() },
            to: String,
            from: String,
            amount: Number,
          },
        ],
        withdrawOnBank: [
          {
            time: { type: Date, default: Date.now() },
            to: String,
            amount: Number,
          },
        ],
      },
      referCode: { type: String, unique: true },
      withdrawPerc: { type: Number, default: 50 },
      Priority: {
        no_1: { type: String, default: "recharge" },
        no_2: { type: String, default: "nextInvest" },
        no_3: { type: String, default: "withdraw" },
      },
      nextInvestCountG: { type: Number, default: 0 },
      nextInvestCountD: { type: Number, default: 0 },
      nextInvestForMoney: { type: Number, default: 0 },
      userType: { type: String, default: "permanent" },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
