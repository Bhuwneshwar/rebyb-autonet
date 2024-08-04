import mongoose, { ObjectId } from "mongoose";

export interface Recharge {
  operator: string;
  state: string;
  validity: number;
  number: string;
  plan: string;
  rechargedAt: Date;
}

// interface IncomeDetails {
//   referralAmount: {
//     amount: number;
//     golden: number;
//     diamond: number;
//     id: string;
//     name: string;
//     date: Date;
//   }[];
//   topUpAmount: {
//     amount: number;
//     date: Date;
//   }[];
//   userAmount: {
//     amount: number;
//     date: Date;
//     id: string;
//     name: string;
//   }[];
// }

// interface ExpenseDetails {
//   recharge: {
//     phone: string;
//     plan: number;
//     validity: number;
//     date: Date;
//     from: string; //"balance or bank"
//   }[];
//   userSend: {
//     id: string;
//     name: string;
//     amount: number;
//     date: Date;
//     from: string;
//   }[];
//   withdrawOnBank: {
//     amount: number;
//     date: Date;
//   }[];
//   invest: {
//     golden: number;
//     diamond: number;
//     amount: number;
//     from: string;
//     date: Date;
//   }[];
// }

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
  contact: string;
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

  password?: string;
  accessToken?: string;

  // RegisteredAt: Date;
  Balance: number;
  // updatedDate: Date;
  // incomes: IncomeDetails;
  // expenses: ExpenseDetails;
  referCode: string;
  withdrawPerc: number;
  Priority: UserPriority;
  nextInvestCountG: number;
  nextInvestCountD: number;
  nextInvestForMoney: number;
  userType: string;
  createdAt: Date;
  updatedAt: Date;
  BalanceAccessPin: string;
  BalanceAccessPinWork: {
    amount: number;
    reason: string;
    ExpiredAt: Date;
    attempt: number;
    tempDataId: ObjectId;
  };
  otpWork: {
    otp?: string;
    otpExpiredAt?: Date;
    attempt?: number;
    otpValidity?: Date;
    verifiedReason: string;
  };
}

export const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [20, "Name cannot exceed 20 characters"],
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
      type: String,
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
      number: String,
      rechargedAt: Date,
      plan: String,
      operator: String,
      state: String,
      validity: Number,
      // Allow flexibility for optional recharge data
    },
    rechargeNum2: {
      // type: mongoose.Schema.Types.Mixed,
      number: String,
      rechargedAt: Date,
      plan: String,
      operator: String,
      state: String,
      validity: Number,
    },
    rechargeNum3: {
      // type: mongoose.Schema.Types.Mixed,
      number: String,
      rechargedAt: Date,
      plan: String,
      operator: String,
      state: String,
      validity: Number,
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

    password: String,
    accessToken: String,

    // RegisteredAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    Balance: {
      type: Number,
      default: 0,
    },
    // updatedDate: {
    //   type: Date,
    //   default: Date.now(),
    // },

    // incomes: {
    //   referralAmount: [
    //     {
    //       amount: Number,
    //       date: Date,
    //       golden: Number,
    //       diamond: Number,
    //       id: String,
    //       name: String,
    //     },
    //   ],
    //   topUpAmount: [
    //     {
    //       amount: Number,
    //       date: Date,
    //     },
    //   ],
    //   userAmount: [
    //     {
    //       amount: Number,
    //       date: Date,
    //       id: String,
    //       name: String,
    //     },
    //   ],
    // },

    // expenses: {
    //   recharge: [
    //     {
    //       phone: String,
    //       plan: Number,
    //       validity: Number,
    //       date: Date,
    //       from: String,
    //     },
    //   ],
    //   userSend: [
    //     {
    //       date: Date,
    //       id: String,
    //       name: String,
    //       amount: Number,
    //       from: String,
    //     },
    //   ],
    //   withdrawOnBank: [
    //     {
    //       amount: Number,
    //       date: Date,
    //     },
    //   ],
    //   invest: [
    //     {
    //       golden: Number,
    //       diamond: Number,
    //       amount: Number,
    //       from: String,
    //       date: Date,
    //     },
    //   ],
    // },
    referCode: { type: String, unique: true, required: true },
    withdrawPerc: { type: Number, default: 100 },
    Priority: {
      no_1: { type: String, default: "recharge" },
      no_2: { type: String, default: "nextInvest" },
      no_3: { type: String, default: "withdraw" },
    },
    nextInvestCountG: { type: Number, default: 0 },
    nextInvestCountD: { type: Number, default: 0 },
    nextInvestForMoney: { type: Number, default: 0 },
    userType: { type: String, default: "permanent" },
    BalanceAccessPin: { type: String, minlength: 6, maxlength: 6 },
    BalanceAccessPinWork: {
      amount: Number,
      reason: String,
      ExpiredAt: Date,
      attempt: Number,
      tempDataId: String,
    },
    otpWork: {
      otp: { type: String, minlength: 6, maxlength: 6 },
      otpExpiredAt: Date,
      attempt: { type: Number, default: 0 },
      otpValidity: Date,
      verifiedReason: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
