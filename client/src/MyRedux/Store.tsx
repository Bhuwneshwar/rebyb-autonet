interface RechargeDetails {
  operator?: string;
  state?: string;
  validity?: number;
  number?: string;
  plan?: string;
}

interface Expenses {
  recharge: any[];
  userSend: any[];
  withdrawOnBank: any[];
}

interface Incomes {
  referralAmount: any[];
  topupAmount: any[];
  userAmount: any[];
}

interface LastMessage {
  referCode: string;
  message: string;
  time: string;
  name: string;
}

export interface IMyDetails {
  _id: string;
  name: string;
  Balance: number;
  RegisteredAt: Date;
  age: number;
  canBuyDiamond: any[];
  canBuyGolden: any[];
  contact: string;
  coverImg: string;
  profileImg: string;

  email: string;
  rechargeNum1: RechargeDetails;
  rechargeNum2: RechargeDetails;
  rechargeNum3: RechargeDetails;
  expenses: Expenses;
  gender: string;
  incomes: Incomes;
  lastMesssge: LastMessage;
  password: boolean;
  rechNums: any[];
  updatedDate: string;
  referCode: string;
  transactionMethod: string;
  upi?: string;
  ifsc?: string;
  bank?: string;
  autoRecharge: boolean;
  autoWithdraw: boolean;
  NextInvest: boolean;
  allMessages: any[];
  newMessage: string;
  diamondFunds: {
    buyTime: Date;
    fund: number;
    funding: {
      many: number;
      when: Date;
      _id: string;
    };
  };
  goldenFunds: {
    buyTime: Date;
    fund: number;
    funding: {
      many: number;
      when: Date;
      _id: string;
    };
  };
}

export interface InitialState {
  nav: boolean;
  activeMsgTab: string;
  role: string;
  MyDetails?: IMyDetails;
  loading: boolean;
  error: any;
}

const initialState: InitialState = {
  nav: false,
  activeMsgTab: "simple-msg",
  role: "public", // public, admin, user, editor, employee
  loading: false,
  error: null,
};

export default initialState;
