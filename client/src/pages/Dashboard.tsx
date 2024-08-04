import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useGlobalContext } from "../MyRedux";
import { formatDate } from "../utils/formatDate";
import { toast } from "react-toastify";
import { paymentUsingRazorpay } from "../utils/PaymentUsingRazorpay";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import investIcon from "../assets/Investment-icon-by-back1design1-3 (1).svg";
import { usePaymentVerify } from "../utils/usePaymentVerify";

const Dashboard: React.FC = () => {
  const {
    dispatch,
    store: { MyDetails, successResponseData },
  } = useGlobalContext();
  const { paymentVerify } = usePaymentVerify();

  const [input_data, setInputData] = useState({
    topUp: "10",
    withDraw: "10",
    rechargePlan: 250,
    rechargeNumber: "",
    golden: 0,
    diamond: 0,
    mrHistoryToggle: false,
  });
  interface IFunds {
    diamondFunds: {
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
        referral: number;
        service: number;
      };
      funding: {
        amount: number;
        date: Date;
        id: string;
        upcoming: boolean;
      }[];
    }[];
    goldenFunds: {
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
        referral: number;
        service: number;
      };
      funding: {
        amount: number;
        date: Date;
        id: string;
        upcoming: boolean;
      }[];
    }[];
  }

  const [funds, setFunds] = useState<IFunds>({
    goldenFunds: [],
    diamondFunds: [],
  });
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;
    setInputData({
      ...input_data,
      [name]: value,
    });
  };

  // const changePassword = async () => {
  //   try {
  //     const response = await axios.post(
  //       "/api/v1/change-password",
  //       { prevPass: input_data.prevPass, currentPass: input_data.currentPass },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     const data = response.data;
  //     if (typeof data === "string") {
  //       toast.info(data, {
  //         position: "bottom-center",
  //       });
  //     }
  //     console.log(data);
  //     if (data.redirect) {
  //       navigate(data.redirect);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const setReferCode = async () => {
  //   try {
  //     const response = await axios.post(
  //       "/api/v1/account-refer",
  //       { referCode: input_data.referCode },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     const data = response.data;
  //     console.log(data);
  //     if (data.redirect) {
  //       navigate(data.redirect);
  //     }
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const genReferCode = async () => {
  //   try {
  //     const response = await axios.get("/api/v1/account-refer", {
  //       withCredentials: true,
  //     });
  //     const data = response.data;
  //     console.log(data);
  //     if (data.redirect) {
  //       navigate(data.redirect);
  //     }
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //     if (data.referCode) {
  //       handleChange({
  //         target: { name: "referCode", value: data.referCode },
  //       } as ChangeEvent<HTMLInputElement>);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const paymentVerifySendMoney = async (response: any) => {
  //   try {
  //     const res = await axios.post(
  //       "/api/v1/account/payment/verification/sendMoney",
  //       response,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     const data = res.data;
  //     console.log(data);
  //     if (data.redirect) navigate(data.redirect);
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //   } catch (e) {
  //     console.log("paymentVerifySendMoney error:", e);
  //   }
  // };

  // const paymentVerify = async (response: any) => {
  //   alert("redirecting...");
  //   try {
  //     const res = await axios.post(
  //       "/api/v1/account/payment/verification",
  //       response,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     const data = res.data;
  //     console.log(data);
  //     if (data.redirect) navigate(data.redirect);
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const paymentVerifyAddFunds = async (response: any) => {
  //   alert("redirecting...");
  //   try {
  //     const res = await axios.post(
  //       "/api/v1/account/payment/verification/add/funds",
  //       response,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     const data = res.data;
  //     console.log(data);
  //     if (data.redirect) navigate(data.redirect);
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const topupVerify = async (response: any) => {
  //   try {
  //     console.log({ response });
  //   } catch (error) {}
  // };

  const topUp = async () => {
    try {
      dispatch("loading", true);
      const response = await axios.post(
        "/api/v1/top-up",
        { amount: +input_data.topUp },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log({ data });
      // if (data.redirect) {
      //   navigate(data.redirect);
      // }
      interface Order {
        id: string;
        amount: number;
      }
      interface Data {
        success: boolean;
        key: string;
        name: string;
        email: string;
        contact: string;
        order: Order;
        message: string;
        status: string;
        error: string;
      }
      const { success, key, name, email, contact, order }: Data = data;
      if (success) {
        paymentUsingRazorpay({
          name,
          email,
          contact,
          order,
          key,
          callBackFunction: paymentVerify,
        });
      } else {
        console.log({ data });
        toast.error(data.error, { position: "bottom-center" });
      }
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        toast.error(e.message, { position: "bottom-center" });
      } else {
        toast.error("An unexpected error occurred", {
          position: "bottom-center",
        });
      }
    }
    dispatch("loading", false);
  };

  const withDraw = async () => {
    try {
      dispatch("loading", true);
      const response = await axios.post(
        "/api/v1/withdraw",
        { amount: +input_data.withDraw },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log({ data });
      if (data.success) {
        toast.success("Withdrawal request sent", { position: "bottom-center" });
      }

      if (data.error) {
        toast.error(data.error, { position: "bottom-center" });
      }
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        toast.error(e.message, { position: "bottom-center" });
      } else {
        toast.error("An unexpected error occurred", {
          position: "bottom-center",
        });
      }
    }
    dispatch("loading", false);
  };

  // const rechargeNow = async () => {
  //   try {
  //     const response = await axios.post(
  //       "/api/v1/account-recharge",
  //       {
  //         contact: input_data.rechargeNumber,
  //         rechargePlan: input_data.rechargePlan,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     const data = response.data;
  //     console.log(data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const buyGolden = async () => {
  //   try {
  //     const response = await axios.post(
  //       "/api/v1/account-buy-golden",
  //       { amount: input_data.golden },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     const data = response.data;
  //     const { success, key, name, email, contact, order } = data;
  //     if (success) {
  //       paymentUsingRazorpay({
  //         name,
  //         email,
  //         contact,
  //         order,
  //         key,
  //         callBackFunction: paymentVerify,
  //       });
  //     } else {
  //       console.log(data);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const sendMoney = async () => {
  //   try {
  //     const response = await axios.post(
  //       "/api/v1/account-send-money",
  //       {
  //         toAccount: input_data.fromAccountSendMoney,
  //         amount: input_data.amount,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     const data = response.data;
  //     const { success, key, name, email, contact, order } = data;
  //     if (success) {
  //       paymentUsingRazorpay({
  //         key,
  //         name,
  //         email,
  //         contact,
  //         order,
  //         callBackFunction: paymentVerifySendMoney,
  //       });
  //     } else {
  //       console.log(data);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const investFromBalance = async (from: string) => {
    try {
      dispatch("loading", true);
      const res = await axios.post(
        `/api/v1/invest`,
        {
          golden: +input_data.golden,
          diamond: +input_data.diamond,
          from,
        },
        {
          withCredentials: true,
        }
      );

      console.log({ res });
      if (res.data.requestBalancePin) {
        toast.warning("Please Enter your Balance PIN");
        dispatch("balancePinModel", true);
        dispatch("balancePinFormData", JSON.stringify(res.data));
      }
      // if (res.data.success) {
      //   toast.success("Successfully buying the funds");
      //   if (res.data.balance) {
      //     // dispatch("MyDetails", { ...MyDetails, Balance: res.data.balance });
      //   }
      // }
      if (res.data.error) {
        toast.error(res.data.error, { position: "bottom-center" });
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.message, { position: "bottom-center" });
      } else {
        toast.error("An unexpected error occurred", {
          position: "bottom-center",
        });
      }
    }
    dispatch("loading", false);
  };

  useEffect(() => {
    if (successResponseData && MyDetails) {
      try {
        const objData = JSON.parse(successResponseData);
        console.log({ objData });
        if (objData.canBuyDiamond && objData.canBuyGolden) {
          dispatch("MyDetails", {
            ...MyDetails,
            canBuyDiamond: objData.canBuyDiamond,
            canBuyGolden: objData.canBuyGolden,
            Balance: objData.Balance,
          });
          toast.success(" Purchase completed successfully");
          // initial();
        }
        if (objData.type === "buy-funds-using-balance") {
          toast.success("Funds added successfully");

          // initial();
        }
        if (objData.type === "top-up" && objData.Balance) {
          dispatch("MyDetails", {
            ...MyDetails,
            Balance: objData.Balance,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [successResponseData]);
  const investFromAccount = async (from: string) => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post(
        "/api/v1/invest",
        {
          golden: +input_data.golden,
          diamond: +input_data.diamond,
          from,
        },
        {
          withCredentials: true,
        }
      );

      console.log({ data });

      const { success, key, name, email, contact, order } = data;
      if (success) {
        await paymentUsingRazorpay({
          key,
          name,
          email,
          contact,
          order,
          callBackFunction: paymentVerify,
        });
      }
      if (data.error) {
        toast.error(data.error, { position: "bottom-center" });
      }

      //end
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        toast.error(e.message, { position: "bottom-center" });
      } else {
        toast.error("An unexpected error occurred", {
          position: "bottom-center",
        });
      }
    }
    dispatch("loading", false);
  };

  // useEffect(() => {
  //   // fetchData();
  //   if (MyDetails) {
  //     setData({ ...MyDetails });
  //   }
  // }, [MyDetails]);

  // useEffect(() => {
  //   console.log(data);
  //   if (data) {
  //     handleChange({
  //       target: { name: "referCode", value: data.referCode },
  //     } as ChangeEvent<HTMLInputElement>);
  //   }
  // }, [data]);
  const initial = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.get("/api/v1/dashboard", {
        withCredentials: true,
      });
      console.log("dashboard data", { data });

      if (data.success) {
        setFunds(() => ({
          goldenFunds: data.goldenFunds,
          diamondFunds: data.diamondFunds,
        }));
        toast.success("Dashboard data loaded successfully", {
          position: "bottom-center",
        });
      }
      if (data.error) {
        toast.error(data.error, { position: "bottom-center" });
      }
    } catch (error: any) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.message, { position: "bottom-center" });
      } else {
        toast.error("An unexpected error occurred", {
          position: "bottom-center",
        });
      }
    }
    dispatch("loading", false);
  };
  useEffect(() => {
    initial();
  }, []);
  // useEffect(() => {}, [MyDetails?.goldenFunds]);

  return MyDetails ? (
    <>
      <div className="dashboard">
        <h1>
          {" "}
          <span>Welcome {MyDetails.name}</span>{" "}
        </h1>
        <div className="d-f">
          <div className="balance">
            {" "}
            Balance: ₹{MyDetails.Balance.toFixed(2)}
          </div>
          <div className="date">
            Registration Date: {formatDate(MyDetails?.createdAt)}
          </div>
        </div>

        <div className="diamond-bg">
          <h3> 💎 Diamond Funds 💎</h3>
          <div className="wtb responsive">
            {funds.diamondFunds.map((item) => (
              <div className="fund">
                <div className="return">
                  <FileDownloadDoneIcon className="i" />

                  <span> ₹{item.fund}.00</span>

                  <span className="diamond-id">Diamond ID: {item.id}</span>
                </div>

                <div className="date">
                  <span>Buy At: </span>
                  <span>{formatDate(item.buyTime)}</span>
                </div>
                <div className="percent">
                  <div className="info">
                    <span className="oma"> {item.fund}</span>
                    <span className="perti">
                      {((item.fund / 2000) * 100).toFixed(2) + "%"}
                    </span>
                    <span className="out_of">2000 </span>
                  </div>
                  <div className="level-bg">
                    <div
                      style={{ width: (item.fund / 2000) * 100 + "%" }}
                      className="level"
                    ></div>
                  </div>
                </div>
                <div
                  className={
                    input_data.mrHistoryToggle
                      ? "return-history expend"
                      : "return-history"
                  }
                >
                  <div className="toggle">
                    <label htmlFor="m-r-history-toggle">
                      Money Return History
                    </label>
                    <input
                      onChange={() =>
                        setInputData((prev) => ({
                          ...prev,
                          mrHistoryToggle: !input_data.mrHistoryToggle,
                        }))
                      }
                      checked={input_data.mrHistoryToggle}
                      id="m-r-history-toggle"
                      type="checkbox"
                      hidden
                    />
                    <KeyboardArrowDownIcon
                      className={input_data.mrHistoryToggle ? "ir" : "i"}
                    />
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.funding.map((fund) => (
                        <tr className={fund.upcoming ? "upcoming" : ""}>
                          <td>{fund.amount}</td>
                          <td>{formatDate(fund.date)}</td>
                          <td>{fund.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p>
                    Money Expend History: {item.expendHistory.level1.fund}
                    -&gt;ID:{item.expendHistory.level1.id},{" "}
                    {item.expendHistory.level2.fund}-&gt;ID:
                    {item.expendHistory.level2.id},{" "}
                    {item.expendHistory.referral}-&gt;Referral,
                    {item.expendHistory.service}-&gt;service{" "}
                  </p>
                </div>
                <p className="note">
                  <span>NOTE: </span>Total Return Amount will take av. 3 months.
                </p>
              </div>
            ))}

            <div className="fund total diamond">
              <h3>Total Diamond Funds</h3>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Diamond</th>
                      <th>X</th>
                      <th>Value</th>
                      <th>EQ</th>
                      <th>Total</th>
                      <th>Describe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{funds.diamondFunds.length}</td>
                      <td>X</td>
                      <td>1000</td>
                      <td>=</td>
                      <td>{funds.diamondFunds.length * 1000}</td>
                      <td>Invested</td>
                    </tr>
                    <tr>
                      <td>{funds.diamondFunds.length}</td>
                      <td>X</td>
                      <td>2000</td>
                      <td>=</td>
                      <td>{funds.diamondFunds.length * 2000}</td>
                      <td>Incoming</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>count</td>
                      <td>of</td>
                      <td> returned </td>
                      <td>
                        {funds.diamondFunds
                          .map((item) => item.fund)
                          .reduce(
                            (accumulator, currentValue) =>
                              accumulator + currentValue,
                            0
                          )}
                      </td>
                      <td>Returned</td>
                    </tr>
                  </tbody>
                </table>
                <div className="percent">
                  <div className="info">
                    <span className="oma">
                      {" "}
                      {funds.diamondFunds
                        .map((item) => item.fund)
                        .reduce(
                          (accumulator, currentValue) =>
                            accumulator + currentValue,
                          0
                        )}
                    </span>
                    <span className="perti">
                      {(
                        (funds.diamondFunds
                          .map((item) => item.fund)
                          .reduce(
                            (accumulator, currentValue) =>
                              accumulator + currentValue,
                            0
                          ) /
                          (funds.diamondFunds.length * 2000)) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                    <span className="out_of">
                      {funds.diamondFunds.length * 2000}{" "}
                    </span>
                  </div>
                  <div className="level-bg">
                    <div
                      style={{
                        width:
                          (funds.diamondFunds
                            .map((item) => item.fund)
                            .reduce(
                              (accumulator, currentValue) =>
                                accumulator + currentValue,
                              0
                            ) /
                            (funds.diamondFunds.length * 2000)) *
                            100 +
                          "%",
                      }}
                      className="level"
                    ></div>
                  </div>
                </div>
              </div>
              <p className="note">
                <span>NOTE: </span>Total Return Amount will take av. 3 months.
              </p>
            </div>

            <a href="#add-fund" className="fund-add">
              <p>
                <span>{MyDetails.canBuyDiamond.length}</span> Add New Diamond
                Fund
              </p>
              <div>
                <AddIcon className="i" />
              </div>
              <p className="note">
                <span>NOTE: </span>Total Return Amount will take av. 3 months.
              </p>
            </a>
          </div>
        </div>

        <div className="golden-bg">
          <h3> 🥇 Golden Funds 🥇 </h3>
          <div className="wtb responsive">
            {funds.goldenFunds.map((item) => (
              <div className="fund">
                <div className="return">
                  <FileDownloadDoneIcon className="i" />

                  <span> ₹{item.fund}.00</span>

                  <span className="diamond-id">Golden ID: {item.id}</span>
                </div>

                <div className="date">
                  <span>Buy At: </span>
                  <span>{formatDate(item.buyTime)}</span>
                </div>
                <div className="percent">
                  <div className="info">
                    <span className="oma"> {item.fund}</span>
                    <span className="perti">
                      {((item.fund / 1000) * 100).toFixed(2)}%
                    </span>
                    <span className="out_of">1000 </span>
                  </div>
                  <div className="level-bg">
                    <div
                      style={{ width: (item.fund / 1000) * 100 + "%" }}
                      className="level"
                    ></div>
                  </div>
                </div>
                <div
                  className={
                    input_data.mrHistoryToggle
                      ? "return-history expend"
                      : "return-history"
                  }
                >
                  <div className="toggle">
                    <label htmlFor="m-r-history-toggle">
                      Money Return History
                    </label>
                    <input
                      onChange={(e) =>
                        setInputData((prev) => ({
                          ...prev,
                          mrHistoryToggle: !input_data.mrHistoryToggle,
                        }))
                      }
                      checked={input_data.mrHistoryToggle}
                      id="m-r-history-toggle"
                      type="checkbox"
                      hidden
                    />
                    <KeyboardArrowDownIcon
                      className={input_data.mrHistoryToggle ? "ir" : "i"}
                    />
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.funding.map((fund) => (
                        <tr className={fund.upcoming ? "upcoming" : ""}>
                          <td>{fund.amount}</td>
                          <td>{formatDate(fund.date)}</td>
                          <td>{fund.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p>
                    Money Expend History: {item.expendHistory.level1.fund}
                    -&gt;ID:{item.expendHistory.level1.id},{" "}
                    {item.expendHistory.level2.fund}-&gt;ID:
                    {item.expendHistory.level2.id},{" "}
                    {item.expendHistory.referral}-&gt;Referral,
                    {item.expendHistory.service}-&gt;service{" "}
                  </p>
                </div>
                <p className="note">
                  <span>NOTE: </span>Total Return Amount will take av. 3 months.
                </p>
              </div>
            ))}
            <div className="fund total golden">
              <h3>Total Diamond Funds</h3>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Diamond</th>
                      <th>X</th>
                      <th>Value</th>
                      <th>EQ</th>
                      <th>Total</th>
                      <th>Describe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{funds.goldenFunds.length}</td>
                      <td>X</td>
                      <td>500</td>
                      <td>=</td>
                      <td>{funds.goldenFunds.length * 500}</td>
                      <td>Invested</td>
                    </tr>
                    <tr>
                      <td>{funds.goldenFunds.length}</td>
                      <td>X</td>
                      <td>1000</td>
                      <td>=</td>
                      <td>{funds.goldenFunds.length * 1000}</td>
                      <td>Incoming</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>count</td>
                      <td>of</td>
                      <td> returned </td>
                      <td>
                        {funds.goldenFunds
                          .map((item) => item.fund)
                          .reduce(
                            (accumulator, currentValue) =>
                              accumulator + currentValue,
                            0
                          )}
                      </td>
                      <td>Returned</td>
                    </tr>
                  </tbody>
                </table>
                <div className="percent">
                  <div className="info">
                    <span className="oma">
                      {" "}
                      {funds.goldenFunds
                        .map((item) => item.fund)
                        .reduce(
                          (accumulator, currentValue) =>
                            accumulator + currentValue,
                          0
                        )}
                    </span>
                    <span className="perti">
                      {(
                        (funds.goldenFunds
                          .map((item) => item.fund)
                          .reduce(
                            (accumulator, currentValue) =>
                              accumulator + currentValue,
                            0
                          ) /
                          (funds.goldenFunds.length * 1000)) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                    <span className="out_of">
                      {funds.goldenFunds.length * 1000}{" "}
                    </span>
                  </div>
                  <div className="level-bg">
                    <div
                      style={{
                        width:
                          (funds.goldenFunds
                            .map((item) => item.fund)
                            .reduce(
                              (accumulator, currentValue) =>
                                accumulator + currentValue,
                              0
                            ) /
                            (funds.goldenFunds.length * 1000)) *
                            100 +
                          "%",
                      }}
                      className="level"
                    ></div>
                  </div>
                </div>
              </div>
              <p className="note">
                <span>NOTE: </span>Total Return Amount will take av. 3 months.
              </p>
            </div>
            <a href="#add-fund" className="fund-add">
              <p>
                <span>{MyDetails.canBuyGolden.length}</span> Add New Golden Fund
              </p>
              <div>
                <AddIcon className="i" />
              </div>
              <p className="note">
                <span>NOTE: </span>Total Return Amount will take av. 3 months.
              </p>
            </a>
          </div>
        </div>

        <div className="fund total golden diamond">
          <h3> 💎 Total Diamond & Golden Funds 🥇 </h3>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Golden</th>
                  <th>
                    <AddIcon />
                  </th>
                  <th>Diamond</th>
                  <th>EQ</th>
                  <th>Total</th>
                  <th>Describe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{funds.goldenFunds.length * 500}</td>
                  <td>
                    <AddIcon />
                  </td>
                  <td>{funds.diamondFunds.length * 1000}</td>
                  <td>=</td>
                  <td>
                    {funds.goldenFunds.length * 500 +
                      funds.diamondFunds.length * 1000}
                  </td>
                  <td>Invested</td>
                </tr>
                <tr>
                  <td>{funds.goldenFunds.length * 500 * 2}</td>
                  <td>
                    <AddIcon />
                  </td>
                  <td>{funds.diamondFunds.length * 1000 * 2}</td>
                  <td>=</td>
                  <td>
                    {funds.goldenFunds.length * 500 * 2 +
                      funds.diamondFunds.length * 1000 * 2}
                  </td>
                  <td>Incoming</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>count</td>
                  <td>of both</td>
                  <td> returned </td>
                  <td>
                    {funds.goldenFunds
                      .map((item) => item.fund)
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      ) +
                      funds.diamondFunds
                        .map((item) => item.fund)
                        .reduce(
                          (accumulator, currentValue) =>
                            accumulator + currentValue,
                          0
                        )}
                  </td>
                  <td>Returned</td>
                </tr>
              </tbody>
            </table>
            <div className="percent">
              <div className="info">
                <span className="oma">
                  {" "}
                  {funds.goldenFunds
                    .map((item) => item.fund)
                    .reduce(
                      (accumulator, currentValue) => accumulator + currentValue,
                      0
                    ) +
                    funds.diamondFunds
                      .map((item) => item.fund)
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      )}
                </span>
                <span className="perti">
                  {(
                    ((funds.goldenFunds
                      .map((item) => item.fund)
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      ) +
                      funds.diamondFunds
                        .map((item) => item.fund)
                        .reduce(
                          (accumulator, currentValue) =>
                            accumulator + currentValue,
                          0
                        )) /
                      (funds.goldenFunds.length * 500 * 2 +
                        funds.diamondFunds.length * 1000 * 2)) *
                    100
                  ).toFixed(2)}
                  %
                </span>
                <span className="out_of">
                  {" "}
                  {funds.goldenFunds.length * 500 * 2 +
                    funds.diamondFunds.length * 1000 * 2}{" "}
                </span>
              </div>
              <div className="level-bg">
                <div
                  style={{
                    width:
                      ((funds.goldenFunds
                        .map((item) => item.fund)
                        .reduce(
                          (accumulator, currentValue) =>
                            accumulator + currentValue,
                          0
                        ) +
                        funds.diamondFunds
                          .map((item) => item.fund)
                          .reduce(
                            (accumulator, currentValue) =>
                              accumulator + currentValue,
                            0
                          )) /
                        (funds.goldenFunds.length * 500 * 2 +
                          funds.diamondFunds.length * 1000 * 2)) *
                        100 +
                      "%",
                  }}
                  className="level"
                ></div>
              </div>
            </div>
            <p className="note">
              <span>NOTE: </span>Total Return Amount will take av. 3 months.
            </p>
          </div>
        </div>
        <div id="add-fund" className="choose-fund">
          <h2>Choose Funds</h2>
          <div className="notes">
            <div className="diamond note">
              <label htmlFor="diamond">Diamond : </label>
              <select
                name="diamond"
                id="diamond"
                value={input_data.diamond}
                onChange={handleChange}
              >
                <option value="0">0</option>
                {MyDetails.canBuyDiamond.map((v, i) => {
                  return <option value={v}>{v + " X"}</option>;
                })}
              </select>
              <p>
                Invest: {input_data.diamond * 1000}; Return:{" "}
                {input_data.diamond * 2000} in under 3 months
              </p>
            </div>
            <div className="golden note">
              <label htmlFor="golden">Golden : </label>
              <select
                name="golden"
                id="golden"
                value={input_data.golden}
                onChange={handleChange}
              >
                <option value="0">0</option>
                {MyDetails.canBuyGolden.map((v, i) => {
                  return <option value={v}>{v + " X"}</option>;
                })}
              </select>
              <p>
                Invest: {input_data.golden * 500}; Return:{" "}
                {input_data.golden * 1000} in under 3 months
              </p>
            </div>
          </div>
          <p>
            Total Invest: {input_data.diamond * 1000 + input_data.golden * 500}{" "}
            Return: {input_data.golden * 1000 + input_data.diamond * 2000} in
            under 3 months
          </p>
          <div className="btn">
            <div className="total-amount">
              <img src={investIcon} alt="icon" />
              Investable Amount{" "}
              {input_data.diamond * 1000 + input_data.golden * 500}
            </div>
            <button onClick={() => investFromBalance("balance")}>
              Invest From Balance
            </button>
            <button onClick={() => investFromAccount("account")}>
              Invest From Account
            </button>
          </div>
        </div>
        {/* <div className="btns">
          <button onClick={(e) => navigate("/signup")}> Add New User</button>
        </div> */}
        <div className="responsive">
          <div className="border-label">
            <span>Primary Phone Number</span>
            <p>6205085598</p>
          </div>
          <div className="border-label">
            <span>Primary Email ID</span>
            <p>krabi6563@gmail.com</p>
          </div>
        </div>

        <div className="responsive">
          <div className="border-label">
            <span>Top Up From Bank</span>
            <input
              type="number"
              placeholder="Amount..."
              onChange={handleChange}
              name="topUp"
              id=""
              value={input_data.topUp}
            />
            <br />
            <button onClick={topUp}>TopUp</button>
          </div>
          <div className="border-label">
            <span>Withdraw on Bank</span>
            <input
              type="number"
              placeholder="Amount..."
              onChange={handleChange}
              name="withDraw"
              id=""
              value={input_data.withDraw}
            />
            <br />
            <button onClick={withDraw}>Withdraw</button>
          </div>
          <div className="border-label">
            <span>Recharge Now</span>
            <div className="d-g">
              <select
                onChange={handleChange}
                value={input_data.rechargeNumber}
                name="rechNumber"
                id="rechargeNums"
              >
                <option value="0">select contact</option>
                {/* {data.rechNums.map((ob, i) => {
                    return (
                      <option key={i} value={ob.rechNumber}>
                        {ob.rechNumber}
                      </option>
                    );
                  })} */}
              </select>
              <input type="number" placeholder="Amount..." />
            </div>

            <button>Recharge Now</button>
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
};

export default Dashboard;
