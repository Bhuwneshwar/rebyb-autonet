interface RechargeDetails {
  operator?: string;
  state?: string;
  validity?: number;
  number?: string;
  plan?: string;
}

export interface Expenses {
  recharge: {
    number: string;
    plan: number;
    validity: number;
    date: Date;
    from: string;
  }[];
  userSend: {
    id: string;
    name: string;
    amount: number;
    date: Date;
    from: string;
  }[];
  withdrawOnBank: {
    amount: number;
    date: Date;
  }[];
  invest: {
    golden: number;
    diamond: number;
    amount: number;
    from: string;
    date: Date;
  }[];
}

export interface Incomes {
  referralAmount: {
    amount: number;
    golden: number;
    diamond: number;
    id: string;
    name: string;
    date: Date;
  }[];
  topupAmount: {
    amount: number;
    date: Date;
  }[];
  userAmount: {
    amount: number;
    date: Date;
    id: string;
    name: string;
  }[];
}

interface LastMessage {
  referCode: string;
  message: string;
  time: string;
  name: string;
}

export interface IMyDetails {
  id: string;
  name: string;
  Balance: number;
  createdAt: Date;
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
  expenses?: Expenses;
  incomes?: Incomes;
  gender: string;
  lastMesssge: LastMessage;
  password: boolean;
  rechNums: any[];
  updatedAt: Date;
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
  diamondFunds?: {
    buyTime: Date;
    fund: number;
    id: number;
    expendHistory: {
      level1: {
        fund: number;
        id: number;
      };
      level2: {
        fund: number;
        id: number;
      };
      refferal: number;
      service: number;
    };
    funding: {
      amount: number;
      date: Date;
      id: string;
      upcoming: boolean;
    }[];
  }[];
  goldenFunds?: {
    buyTime: Date;
    fund: number;
    id: number;
    expendHistory: {
      level1: {
        fund: number;
        id: number;
      };
      level2: {
        fund: number;
        id: number;
      };
      refferal: number;
      service: number;
    };
    funding: {
      amount: number;
      date: Date;
      id: string;
      upcoming: boolean;
    }[];
  }[];
  balancePin: boolean;
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
  balancePinModel: boolean;
  successResponseData?: string;
  balancePinFormData?: string;
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
  balancePinModel: false,
};

export default initialState;
