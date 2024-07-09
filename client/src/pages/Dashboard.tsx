import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useGlobalContext } from "../MyRedux";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import Loding from "../components/Loding";
import { toast } from "react-toastify";
import PaymentUsingRazorpay from "../utils/PaymentUsingRazorpay";
import { IMyDetails } from "../MyRedux/Store";

interface InputData {
  sdmn: number;
  identifyId: string;
  topup: string;
  withDraw: string;
  rechargePlan: number;
  rechNumber: string;
  golden: number;
  diamond: number;
  prevPass: string;
  currentPass: string;
  name: string;
  age: string;
  gender: string;
  email: string;
  Identifier: string;
  buyGoldenSelected: string;
  buyDiamondSelected: string;
  fromAccount: string;
  fromAccountSendMoney: string;
  message: string;
  recievedId: string;
  referCode: string;
  amount: number;
}

// interface Data {
//   Balance: number;
//   rechNums: { rechNumber: string }[];
//   canBuyDiamond: number[];
//   canBuyGolden: number[];
//   lastMesssge: {
//     referCode: string;
//     name: string;
//     message: string;
//   };
//   name: string;
//   RegisteredAt: Date;
//   age: number;
//   contact: string;
//   email: string;
//   gender: string;
//   _id: string;
//   referCode: string;
//   password?: string;
//   redirect?: string;
//   updated?: Data;
// }

const Dashboard: React.FC = () => {
  // const formattedDate = formatDate();

  const navigate = useNavigate();
  const {
    dispatch,
    store: { MyDetails },
  } = useGlobalContext();
  console.log("newMesssge", MyDetails?.newMessage);
  const [data, setData] = useState<IMyDetails | null>(null);
  const [send_box, setSendBox] = useState(false);
  const [input_data, setInputData] = useState<InputData>({
    sdmn: 5,
    identifyId: "",
    topup: "10",
    withDraw: "10",
    rechargePlan: 250,
    rechNumber: "",
    golden: 0,
    diamond: 0,
    prevPass: "",
    currentPass: "",
    name: "",
    age: "",
    gender: "",
    email: "",
    Identifier: "6205085599",
    buyGoldenSelected: "0",
    buyDiamondSelected: "0",
    fromAccount: "",
    fromAccountSendMoney: "",
    message: "",
    recievedId: "",
    referCode: "",
    amount: 0,
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

  useEffect(() => {
    // fetchData();
    if (MyDetails) {
      setData({ ...MyDetails });
    }
  }, [MyDetails]);

  useEffect(() => {
    console.log(data);
    if (data) {
      handleChange({
        target: { name: "referCode", value: data.referCode },
      } as ChangeEvent<HTMLInputElement>);
    }
  }, [data]);

  const changePassword = async () => {
    try {
      const response = await axios.post(
        "/api/v1/change-password",
        { prevPass: input_data.prevPass, currentPass: input_data.currentPass },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (typeof data === "string") {
        toast.info(data, {
          position: "bottom-center",
        });
      }
      console.log(data);
      if (data.redirect) {
        navigate(data.redirect);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const setReferCode = async () => {
    try {
      const response = await axios.post(
        "/api/v1/account-refer",
        { referCode: input_data.referCode },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log(data);
      if (data.redirect) {
        navigate(data.redirect);
      }
      if (data.updated) {
        setData(data.updated);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const genReferCode = async () => {
    try {
      const response = await axios.get("/api/v1/account-refer", {
        withCredentials: true,
      });
      const data = response.data;
      console.log(data);
      if (data.redirect) {
        navigate(data.redirect);
      }
      if (data.updated) {
        setData(data.updated);
      }
      if (data.referCode) {
        handleChange({
          target: { name: "referCode", value: data.referCode },
        } as ChangeEvent<HTMLInputElement>);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const paymentVerifySendMoney = async (response: any) => {
    try {
      const res = await axios.post(
        "/api/v1/account/payment/verification/sendMoney",
        response,
        {
          withCredentials: true,
        }
      );
      const data = res.data;
      console.log(data);
      if (data.redirect) navigate(data.redirect);
      if (data.updated) {
        setData(data.updated);
      }
    } catch (e) {
      console.log("paymentVerifySendMoney error:", e);
    }
  };

  const paymentVerify = async (response: any) => {
    alert("redirecting...");
    try {
      const res = await axios.post(
        "/api/v1/account/payment/verification",
        response,
        {
          withCredentials: true,
        }
      );
      const data = res.data;
      console.log(data);
      if (data.redirect) navigate(data.redirect);
      if (data.updated) {
        setData(data.updated);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const paymentVerifyAddFunds = async (response: any) => {
    alert("redirecting...");
    try {
      const res = await axios.post(
        "/api/v1/account/payment/verification/add/funds",
        response,
        {
          withCredentials: true,
        }
      );
      const data = res.data;
      console.log(data);
      if (data.redirect) navigate(data.redirect);
      if (data.updated) {
        setData(data.updated);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const topupVerify = async (response: any) => {
    try {
      console.log({ response });
    } catch (error) {}
  };

  const topup = async () => {
    try {
      const response = await axios.post(
        "/api/v1/account-topup",
        { amount: input_data.topup },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log(data);
      if (data.redirect) {
        navigate(data.redirect);
      }
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
        PaymentUsingRazorpay({
          name,
          email,
          contact,
          order,
          key,
          callfuntion: topupVerify,
        });
      } else {
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const withDraw = async () => {
    try {
      const response = await axios.post(
        "/api/v1/account-withdraw",
        { amount: input_data.withDraw },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data.updated) {
        setData(data.updated);
      }
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const rechargeNow = async () => {
    try {
      const response = await axios.post(
        "/api/v1/account-recharge",
        {
          contact: input_data.rechNumber,
          rechargePlan: input_data.rechargePlan,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const buyGolden = async () => {
    try {
      const response = await axios.post(
        "/api/v1/account-buy-golden",
        { amount: input_data.golden },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      const { success, key, name, email, contact, order } = data;
      if (success) {
        PaymentUsingRazorpay({
          name,
          email,
          contact,
          order,
          key,
          callfuntion: paymentVerify,
        });
      } else {
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const sendMoney = async () => {
    try {
      const response = await axios.post(
        "/api/v1/account-send-money",
        {
          toAccount: input_data.fromAccountSendMoney,
          amount: input_data.amount,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      const { success, key, name, email, contact, order } = data;
      if (success) {
        PaymentUsingRazorpay({
          key,
          name,
          email,
          contact,
          order,
          callfuntion: paymentVerifySendMoney,
        });
      } else {
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const buyNow = async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/account-invest",
        {
          golden: input_data.golden,
          diamond: input_data.diamond,
        },
        {
          withCredentials: true,
        }
      );

      console.log(data);

      const { success, key, name, email, contact, order } = data;
      if (success) {
        PaymentUsingRazorpay({
          key,
          name,
          email,
          contact,
          order,
          callfuntion: paymentVerifyAddFunds,
        });
      } else {
        console.log(data);
      }

      //end
    } catch (e) {
      console.log(e);
    }
  };

  {
    return data ? (
      <>
        <div className="dashboard">
          <h1>Bhuwneshwar Mandal </h1>
          <div className="d-f">
            <div>Registration Date: {"formattedDate"}</div>
            <div>My Balance: {50050}</div>
          </div>
          <div className="btns">
            <button onClick={(e) => navigate("/signup")}>Add New User</button>
          </div>
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
                name="topup"
                id=""
                value={input_data.topup}
              />
              <br />
              <button onClick={topup}>TopUp</button>
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
                  value={input_data.rechNumber}
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

          <div className="choose-fund">
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
                  {data.canBuyDiamond.map((v, i) => {
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
                  {data.canBuyGolden.map((v, i) => {
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
              Total Invest:{" "}
              {input_data.diamond * 1000 + input_data.golden * 500} Return:{" "}
              {input_data.golden * 1000 + input_data.diamond * 2000} in under 3
              months
            </p>
            <div className="btn">
              <button>
                Invest {input_data.diamond * 1000 + input_data.golden * 500}
              </button>
            </div>
          </div>
          <div className="msg">
            <div className="msgs" onClick={(e) => navigate("/messages/")}>
              Messages <span>9</span>
            </div>
            <div>Last Message</div>
            <div
              className="lastMessage"
              onClick={(e) =>
                navigate("/messages/" + data.lastMesssge.referCode)
              }
            >
              <figure>
                <img
                  src="https://th.bing.com/th/id/OIP.vAuCou6PorBYkntC17e0QAAAAA?rs=1&pid=ImgDetMain"
                  alt="user pic"
                />
              </figure>
              <div className="info">
                <h3>{"Bikram Kumar"}</h3>
                <span>{"hi Dada"} </span>
              </div>
              <div className="time">
                <div>12:00 AM</div>
                <span>10</span>
              </div>
            </div>
          </div>
          {/* 
          <div>{data.name}</div>
          <div>{data.Balance}</div>
          <div>{data.RegisteredAt}</div>
          <div>{data.age}</div>
          <div>{data.contact}</div>
          <div>{data.email}</div>
          <div>{data.gender}</div>
          <div>{data._id}</div>
          <div
            onClick={(e) => navigate("/messages/" + data.lastMesssge.referCode)}
          >
            <h3>{data.lastMesssge.name}</h3>
            <h4>{data.lastMesssge.message} </h4>
          </div>
          <div className="newMesssge">{newMessage}</div>

          <button onClick={(e) => navigate("/signup")}>Add New User</button>
          <div className={send_box ? "send_box" : ""}>
            <h5>Available Balance : {data.Balance}</h5>

            <br />
            <input
              onChange={handleChange}
              name="topup"
              id=""
              value={input_data.topup}
            />
            <button onClick={topup}>TopUp</button>
            <br />
            <br />
            <input
              onChange={handleChange}
              name="withDraw"
              placeholder="Enter Amount "
              id=""
              value={input_data.withDraw}
            />
            <button onClick={withDraw}>Withdraw</button>
            <br />
            <br />
            <select
              onChange={handleChange}
              value={input_data.rechNumber}
              name="rechNumber"
              id="rechargeNums"
            >
              <option value="0">select contact</option>
              {data.rechNums.map((ob, i) => {
                return (
                  <option key={i} value={ob.rechNumber}>
                    {ob.rechNumber}
                  </option>
                );
              })}
            </select>
            <input
              name="rechargePlan"
              onChange={handleChange}
              id=""
              value={input_data.rechargePlan}
            />
            <button onClick={rechargeNow}>Recharge Now</button>
            <br />
            <br />
            <select
              name="golden"
              value={input_data.golden}
              onChange={handleChange}
              id=""
            >
              <option value="0">Select Golden fund</option>
              {data.canBuyGolden.map((v, i) => {
                return <option value={v}>{v + " X"}</option>;
              })}
            </select>
            <select
              value={input_data.diamond}
              name="diamond"
              onChange={handleChange}
              id=""
            >
              <option value="0">Select Diamond fund</option>
              {data.canBuyDiamond.map((v, i) => {
                return <option value={v}>{v + " X"}</option>;
              })}
            </select>
            <button onClick={buyNow}>
              Buy : {input_data.diamond * 1000 + input_data.golden * 500}
            </button>
            <br />

            <br />
            <h3 onClick={(e) => navigate("/messages")}>
              Messages <span></span>
            </h3>
            <br />
            <br />
            {data.password ? (
              <>
                <input
                  name="prevPass"
                  id=""
                  onChange={handleChange}
                  value={input_data.prevPass}
                  placeholder="Enter previous Password"
                />
                <input
                  name="currentPass"
                  id=""
                  onChange={handleChange}
                  value={input_data.currentPass}
                  placeholder="New Password"
                />
              </>
            ) : (
              <input
                name="currentPass"
                id=""
                onChange={handleChange}
                value={input_data.currentPass}
                placeholder="New Password"
              />
            )}
            <button onClick={changePassword}>
              {data.password ? "Change Password" : "Set password"}
            </button>
            <br />
            <br />
            <div id="updateBox">
              <h2>Account Update</h2>
              <input
                name="name"
                id=""
                onChange={handleChange}
                value={data.name}
                placeholder="Name"
              />

              <br />
              <br />
              <h3>Set Refer Code</h3>
              <input
                onChange={handleChange}
                name="referCode"
                id=""
                value={input_data.referCode}
              />
              <button onClick={genReferCode}> Generate Refer Code</button>
              <button onClick={setReferCode}> Set Refer Code</button>
            </div>
          </div> */}
        </div>
      </>
    ) : (
      <Loding />
    );
  }
};

export default Dashboard;
