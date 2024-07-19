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
    }[];
  }[];
  goldenFunds: {
    buyTime: Date;
    fund: number;
    funding: {
      many: number;
      when: Date;
      _id: string;
    }[];
  }[];
}

export interface InitialState {
  nav: boolean;
  activeMsgTab: string;
  role: string;
  MyDetails?: IMyDetails;
  loading: boolean;
  error: any;
  scrolledPosition: {
    //for all pages
    admin: {
      top: number;
      left: number;
    };
    chat: {
      top: number;
      left: number;
    };
    dashboard: {
      top: number;
      left: number;
    };
    home: {
      top: number;
      left: number;
    };
    login: {
      top: number;
      left: number;
    };
    messages: {
      top: number;
      left: number;
    };
    passwordSet: {
      top: number;
      left: number;
    };
    paymentScanner: {
      top: number;
      left: number;
    };
    profile: {
      top: number;
      left: number;
    };
    signup: {
      top: number;
      left: number;
    };
  };
}

const initialState: InitialState = {
  nav: false,
  activeMsgTab: "simple-msg",
  role: "public", // public, admin, user, editor, employee
  loading: false,
  error: null,
  scrolledPosition: {
    //for all pages
    admin: {
      top: 0,
      left: 0,
    },
    chat: {
      top: 0,
      left: 0,
    },
    dashboard: {
      top: 0,
      left: 0,
    },
    home: {
      top: 0,
      left: 0,
    },
    login: {
      top: 0,
      left: 0,
    },
    messages: {
      top: 0,
      left: 0,
    },
    passwordSet: {
      top: 0,
      left: 0,
    },
    paymentScanner: {
      top: 0,
      left: 0,
    },
    profile: {
      top: 0,
      left: 0,
    },
    signup: {
      top: 0,
      left: 0,
    },
    // add more pages here
  },
};

export default initialState;
