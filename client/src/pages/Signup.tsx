import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { move } from "../utils/functions";
import PaymentUsingRazorpay from "../utils/PaymentUsingRazorpay";
import { useGlobalContext } from "../MyRedux";
import Navbar from "../components/Navbar";
import PriorityDragable from "../components/PriorityDragable";

interface Details {
  name: string;
  age: number;
  gender: string;
  phoneNumber: string;
  email: string;
  phoneOtp: string;
  emailOtp: string;
  diamond: number;
  golden: number;
  rechNum1: string;
  rechNum2: string;
  rechNum3: string;
  opera1: string;
  opera2: string;
  opera3: string;
  state1: string;
  state2: string;
  state3: string;
  ExistingValidityOne: number;
  ExistingValiditytwo: number;
  ExistingValiditythree: number;
  autoRecharge: boolean;
  transactionMethod: string;
  autoWithdraw: boolean;
  upi: string;
  ifsc: string;
  bank: string;
  confirmBank: string;
  NextInvest: boolean;
  refer?: string;
  setRefer: string;
  priority: string[];
  withdraw_perc: number;
  SelectedPlan1: string;
  SelectedPlan2: string;
  SelectedPlan3: string;
}

interface IPlan {
  price: number;
  validity: number;
  data: string;
}

interface IinitialData {
  operators: string[];
  states: string[];
  transactionMethods: string[];
  RechargePlans: {
    jio: IPlan[];
    airtel: IPlan[];
    vi: IPlan[];
    bsnl: IPlan[];
    mtnlDelhi: IPlan[];
    mtnlMumbai: IPlan[];
  };
  diamond: number[];
  golden: number[];
  UniqueReferCode: string;
}

const Signup = () => {
  const navigate = useNavigate();

  const { dispatch } = useGlobalContext();

  const { refer } = useParams();
  const [data, setData] = useState<IinitialData | null>(null); // Adjust type as per your API response structure
  const [priority, setPriority] = useState<string[]>([
    "recharge",
    "nextInvest",
    "withdraw",
  ]);
  const [curOpera1, setCurOpera1] = useState<any[]>([]);
  const [curOpera2, setCurOpera2] = useState<any[]>([]);
  const [curOpera3, setCurOpera3] = useState<any[]>([]);
  const [details, setDetails] = useState<Details>({
    name: "Bhuwneshwar Mandal",
    age: 23,
    gender: "male",
    phoneNumber: "6205085598",
    email: "krabi6563@gmail.com",
    phoneOtp: "",
    emailOtp: "",
    diamond: 6,
    golden: 6,
    rechNum1: "6205085598",
    rechNum2: "",
    rechNum3: "",
    opera1: "jio",
    opera2: "",
    opera3: "",
    state1: "Bihar",
    state2: "",
    state3: "",
    ExistingValidityOne: 0,
    ExistingValiditytwo: 0,
    ExistingValiditythree: 0,
    autoRecharge: true,
    transactionMethod: "",
    autoWithdraw: false,
    upi: "",
    ifsc: "",
    bank: "",
    confirmBank: "",
    NextInvest: false,
    refer,
    setRefer: "",
    priority,
    withdraw_perc: 60,
    SelectedPlan1: "",
    SelectedPlan2: "",
    SelectedPlan3: "",
  });
  const [notify, setNotify] = useState({
    num1: "",
    num2: "",
    num3: "",
  });

  const initial = async () => {
    try {
      const { data }: { data: IinitialData } = await axios.get(
        "/api/v1/registration"
      );
      console.log({ data });

      setData({ ...data });
      setDetails((prev) => ({
        ...prev,
        setRefer: data.UniqueReferCode,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    initial();
  }, []);

  useEffect(() => {
    console.log(priority);
    setDetails((prev) => ({
      ...prev,
      priority,
    }));
  }, [data, priority]);

  // useEffect(() => {
  //   console.log(details.opera1);
  //   if (data) checkOperator(details.opera1, setCurOpera1);
  // }, [details.opera1]);

  // useEffect(() => {
  //   if (data) checkOperator(details.opera2, setCurOpera2);
  // }, [details.opera2]);

  // useEffect(() => {
  //   if (data) checkOperator(details.opera3, setCurOpera3);
  // }, [details.opera3]);

  // const checkOperator = (
  //   opera: string,
  //   fun: React.Dispatch<React.SetStateAction<any[]>>
  // ) => {
  //   switch (opera) {
  //     case "jio":
  //       fun(data.RechargePlans.jio);
  //       break;
  //     case "airtel":

  //       fun(data.RechargePlans.airtel);
  //       break;
  //     case "vi":
  //       fun(data.RechargePlans.vi);
  //       break;
  //     case "bsnl":
  //       fun(data.RechargePlans.bsnl);
  //       break;
  //     case "mtnl delhi":
  //       fun(data.RechargePlans.mtnlDelhi);
  //       break;
  //     case "mtnl mumbai":
  //       fun(data.RechargePlans.mtnlMumbai);
  //       break;
  //     default:
  //       fun([]);
  //   }
  // };

  const diamondOpt = (dya: number) => {
    let opt: number[] = [];
    for (let i = 1; i <= dya; i++) {
      opt.push(i);
    }
    console.log(opt);
    return opt;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("details", details);
      const res = await axios.post("/api/v1/registration", details, {
        withCredentials: true,
      });

      const { success, key, name, email, contact, order } = res.data;
      if (success) {
        PaymentUsingRazorpay({
          key,
          name,
          email,
          contact,
          order,
          callfuntion: paymentVerify,
        });
      } else {
        console.log(res);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const paymentVerify = async (response: any) => {
    alert("redirecting...");
    try {
      const res = await axios.post("/api/v1/payment/verification", response, {
        withCredentials: true,
      });

      console.log(res);
      if (res.data.redirect) navigate(res.data.redirect);
    } catch (e) {
      console.log(e);
    }
  };

  const checkNum1 = async () => {
    try {
      if (/([5-9]{1}[0-9]{9})$/.test(details.rechNum1)) {
        const extracted = details.rechNum1.match(/([5-9]{1}[0-9]{9})$/);

        if (extracted?.length) {
          const mob = extracted[0];

          const { data } = await axios.get(`/api/check/number/?mob=${mob}`);
          console.log(data);
          setNotify((prev) => ({
            ...prev,
            num1: data,
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkNum1();
  }, [details.rechNum1]);

  const checkNum2 = async () => {
    try {
      if (/([5-9]{1}[0-9]{9})$/.test(details.rechNum2)) {
        const extracted = details.rechNum2.match(/([5-9]{1}[0-9]{9})$/);

        if (extracted?.length) {
          const mob = extracted[0];

          const { data } = await axios.get(`/api/check/number/?mob=${mob}`);
          console.log(data);
          setNotify((prev) => ({
            ...prev,
            num2: data,
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkNum2();
  }, [details.rechNum2]);

  const checkNum3 = async () => {
    try {
      if (/([5-9]{1}[0-9]{9})$/.test(details.rechNum3)) {
        const extracted = details.rechNum3.match(/([5-9]{1}[0-9]{9})$/);

        if (extracted?.length) {
          const mob = extracted[0];

          const { data } = await axios.get(`/api/check/number/?mob=${mob}`);
          console.log(data);
          setNotify((prev) => ({
            ...prev,
            num3: data,
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkNum3();
  }, [details.rechNum3]);

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const changePriority = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setDetails((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const sendPhoneOtp = async () => {
    try {
      const res = await axios.post("/api/v1/phone/otp/send", {
        contact: details.phoneNumber,
      });
      console.log(res);
      setDetails({ ...details, phoneOtp: res.data.otp });
    } catch (e) {
      console.log(e);
    }
  };

  const verifyPhoneOtp = async () => {
    try {
      const res = await axios.post("/api/v1/phone/otp/verify", {
        contact: details.phoneNumber,
        userOtp: details.phoneOtp,
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  const sendEmailOtp = async () => {
    try {
      const res = await axios.post("/api/v1/email/otp/send", {
        email: details.email,
      });
      console.log(res);
      setDetails({ ...details, emailOtp: res.data.otp });
    } catch (e) {
      console.log(e);
    }
  };

  const verifyEmailOtp = async () => {
    try {
      const res = await axios.post("/api/v1/email/otp/verify", {
        email: details.email,
        userOtp: details.emailOtp,
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setDetails((prev) => ({
      ...prev,
      rechNum1: prev.phoneNumber,
    }));
    event.target.select();
  };

  const getPdf = async () => {
    try {
      let name = "Bhuwneshwar Mandal";
      const response = await fetch(`/api/pdf/${name}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    data && (
      <div className="signup-form">
        <h1>Signup Form </h1>
        <form
          onSubmit={(e) => e.preventDefault()}
          method="post"
          accept-charset="utf-8"
        >
          <div className="bg-white">
            <div className="border-label">
              <label htmlFor="name">Name : </label>
              <input
                onChange={changeHandler}
                name="name"
                id="name"
                value={details.name}
                placeholder="Enter Name here..."
              />
            </div>
            <div className="biog">
              <div className="border-label">
                <label htmlFor="age">Age : </label>
                <input
                  onChange={changeHandler}
                  type="text"
                  name="age"
                  id="age"
                  value={details.age}
                />
              </div>
              <div className="border-label">
                <label htmlFor="gender">Gender : </label>
                <select
                  name="gender"
                  value={details.gender}
                  onChange={changeHandler}
                  id="gender"
                >
                  <option value="0">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="kuchv">kuchv</option>
                </select>
              </div>
            </div>
            <div className="biog">
              <div className="border-label">
                <label htmlFor="number">Phone Number : </label>
                <input
                  onChange={changeHandler}
                  type="number"
                  name="phoneNumber"
                  id="number"
                  value={details.phoneNumber}
                />
                <button onClick={sendPhoneOtp}> send OTP</button>
              </div>
              <div className="border-label">
                <label htmlFor="phoneOtp">OTP: </label>
                <input
                  name="phoneOtp"
                  onChange={changeHandler}
                  id="phoneOtp"
                  value={details.phoneOtp}
                  placeholder="Enter OTP"
                  className="otp-input"
                />
                <button onClick={verifyPhoneOtp}>Verify</button>
              </div>
            </div>
            <div className="biog">
              <div className="border-label email">
                <label htmlFor="email">Email : </label>
                <input
                  onChange={changeHandler}
                  type="email"
                  name="email"
                  id="email"
                  value={details.email}
                />
                <button onClick={sendEmailOtp}> Send OTP</button>
              </div>
              <div className="border-label ">
                <label htmlFor="emailOtp">OTP : </label>
                <input
                  onChange={changeHandler}
                  name="emailOtp"
                  id="emailOtp"
                  value={details.emailOtp}
                  placeholder="Enter OTP"
                  className="otp-input"
                />
                <button onClick={verifyEmailOtp}>Verify</button>
              </div>
            </div>
            <div className="choose-fund">
              <h2>Choose Funds</h2>
              <div className="notes">
                <div className="diamond note">
                  <label htmlFor="diamond">Diamond : </label>
                  <select
                    onChange={changeHandler}
                    name="diamond"
                    id="diamond"
                    value={details.diamond}
                  >
                    <option value="0">0</option>
                    {data?.diamond.map((v) => {
                      return <option value={v}>{v} X 1000</option>;
                    })}
                  </select>
                  <p>
                    Invest: {details.diamond * 1000}; Return:{" "}
                    {details.diamond * 2000} in under 3 months
                  </p>
                </div>
                <div className="golden note">
                  <label htmlFor="golden">Golden : </label>
                  <select
                    value={details.golden}
                    onChange={changeHandler}
                    name="golden"
                    id="golden"
                  >
                    <option value="0">0</option>
                    {data?.golden.map((v) => {
                      return <option value={v}>{v} X 500</option>;
                    })}
                  </select>
                  <p>
                    Invest: {details.golden * 500}; Return:{" "}
                    {details.golden * 1000} in under 3 months
                  </p>
                </div>
              </div>
              <p>
                Total Invest: {details.diamond * 1000 + details.golden * 500}{" "}
                Return: {details.golden * 1000 + details.diamond * 2000} in
                under 3 months
              </p>
            </div>
            <div className="rech-for-num">
              <h2>Recharge for numbers</h2>
              <div className="responsive">
                <div className="num">
                  <label htmlFor="rechNum1">Recharge For Number 1</label>
                  <input
                    type="number"
                    onChange={changeHandler}
                    name="rechNum1"
                    id="rechNum1"
                    onFocus={handleFocus}
                    value={details.rechNum1}
                    placeholder="Recharge num 1"
                  />
                  <p>{notify.num1}</p>
                </div>
                <div className="opera">
                  <label htmlFor="opera1">Select Operator For Number 1</label>
                  <select
                    value={details.opera1}
                    onChange={changeHandler}
                    name="opera1"
                    id="opera1"
                  >
                    <option value="">Select Operator</option>
                    {data?.operators.map((v) => {
                      return <option value={v}>{v}</option>;
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="state1">Select State For Number 1</label>

                  <select
                    value={details.state1}
                    onChange={changeHandler}
                    name="state1"
                    id="state1"
                  >
                    <option value="">Select State</option>
                    {data?.states.map((v) => {
                      return <option value={v}>{v}</option>;
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="SelectedPlan1">
                    Select A Plan For Number 1
                  </label>

                  <select
                    onChange={changeHandler}
                    name="SelectedPlan1"
                    id="SelectedPlan1"
                  >
                    <option value="">Select Plan</option>
                    {curOpera1.map((v) => {
                      return (
                        <option className="plans" value={JSON.stringify(v)}>
                          PRICE:{v.price} VALIDITY :{v.validity} Data:{v.data}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="num">
                  <label htmlFor="ExistingValidityOne">
                    Enter Existing Plan Validity Days For Number 1
                  </label>

                  <input
                    type="number"
                    name="ExistingValidityOne"
                    id="ExistingValidityOne"
                    min={0}
                    max={365}
                    onChange={changeHandler}
                    value={details.ExistingValidityOne}
                    placeholder="Existing Validity "
                  />
                  <p>Error Meassage</p>
                </div>
              </div>
              <hr />

              <div className="responsive">
                <div className="num">
                  <label htmlFor="rechNum2">Recharge For Number 2</label>

                  <input
                    type="number"
                    onChange={changeHandler}
                    name="rechNum2"
                    id="rechNum2"
                    value={details.rechNum2}
                    placeholder="Recharge num 2"
                  />
                  <p>{notify.num2}</p>
                </div>
                <div className="opera">
                  <label htmlFor="opera2">Select Operator For Number 2</label>

                  <select
                    value={details.opera2}
                    onChange={changeHandler}
                    name="opera2"
                    id="opera2"
                  >
                    <option value="">Select Operator</option>
                    {data?.operators.map((v) => {
                      return <option value={v}>{v}</option>;
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="state2">Select State For Number 2</label>

                  <select
                    value={details.state2}
                    onChange={changeHandler}
                    name="state2"
                    id="state2"
                  >
                    <option value="">Select State</option>
                    {data?.states.map((v) => {
                      return <option value={v}>{v}</option>;
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="SelectedPlan2">
                    Select A Plan For Number 2
                  </label>
                  <select
                    onChange={changeHandler}
                    name="SelectedPlan2"
                    id="SelectedPlan2"
                  >
                    <option value="">Select Plan</option>
                    {curOpera2.map((v) => {
                      return (
                        <option className="plans" value={JSON.stringify(v)}>
                          PRICE:{v.price} VALIDITY :{v.validity} Data:{v.data}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="num">
                  <label htmlFor="ExistingValiditytwo">
                    Enter Existing Plan Validity Days For Number 2
                  </label>

                  <input
                    type="number"
                    name="ExistingValiditytwo"
                    id="ExistingValiditytwo"
                    min={0}
                    max={365}
                    onChange={changeHandler}
                    value={details.ExistingValiditytwo}
                    placeholder="Existing Validity "
                  />
                  <p>Error Meassage</p>
                </div>
              </div>
              <hr />

              <div className="responsive">
                <div className="num">
                  <label htmlFor="rechNum3">Recharge For Number 3</label>

                  <input
                    type="number"
                    onChange={changeHandler}
                    name="rechNum3"
                    id="rechNum3"
                    value={details.rechNum3}
                    placeholder="Recharge num 3"
                  />
                  <p>{notify.num3}</p>
                </div>
                <div className="opera">
                  <label htmlFor="opera3">Select Operator For Number 3</label>

                  <select
                    value={details.opera3}
                    onChange={changeHandler}
                    name="opera3"
                    id="opera3"
                  >
                    <option value="">Select Operator</option>
                    {data?.operators.map((v) => {
                      return <option value={v}>{v}</option>;
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="state3">Select State For Number 3</label>

                  <select
                    value={details.state3}
                    onChange={changeHandler}
                    name="state3"
                    id="state3"
                  >
                    <option value="">Select State</option>
                    {data?.states.map((v) => {
                      return <option value={v}>{v}</option>;
                    })}{" "}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="opera">
                  <label htmlFor="SelectedPlan3">
                    Select A Plan For Number 3
                  </label>

                  <select
                    onChange={changeHandler}
                    name="SelectedPlan3"
                    id="SelectedPlan3"
                  >
                    <option value="">Select Plan</option>
                    {curOpera3.map((v) => {
                      return (
                        <option className="plans" value={JSON.stringify(v)}>
                          PRICE:{v.price} VALIDITY :{v.validity} Data:{v.data}
                        </option>
                      );
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="num">
                  <label htmlFor="ExistingValiditythree">
                    Enter Existing Plan Validity Days For Number 3
                  </label>
                  <input
                    type="number"
                    name="ExistingValiditythree"
                    id="ExistingValiditythree"
                    min={0}
                    max={365}
                    onChange={changeHandler}
                    value={details.ExistingValiditythree}
                    placeholder="Existing Validity "
                  />
                  useEffect
                  <p>Error Meassage</p>
                </div>
              </div>
            </div>
            <div className="rech-for-num">
              <h2>Accounts Information</h2>
              <div className="responsive">
                <div className="select-box">
                  <label htmlFor="transactionMethod">
                    Select Transaction Method
                  </label>
                  <select
                    onChange={changeHandler}
                    value={details.transactionMethod}
                    name="transactionMethod"
                    id="transactionMethod"
                  >
                    <option value="">Select Transaction Method</option>
                    {data?.transactionMethods.map((method) => {
                      return <option value={method}>{method}</option>;
                    })}
                  </select>
                  <p>Error Meassage</p>
                </div>
                <div className="input-text">
                  <label htmlFor="transactionMethod">
                    Enter UPI ID/UPI Phone Number
                  </label>

                  <input
                    onChange={changeHandler}
                    name="upi"
                    id=""
                    value={details.upi}
                    placeholder="upi"
                  />
                  <p>Error Meassage</p>
                </div>
                <div className="input-text">
                  <label htmlFor="transactionMethod">IFSC Code</label>

                  <input
                    onChange={changeHandler}
                    name="ifsc"
                    id=""
                    value={details.ifsc}
                    placeholder="IFSC code"
                  />
                  <p>Error Meassage</p>
                </div>
                <div className="input-text">
                  <label htmlFor="transactionMethod">Account Number</label>

                  <input
                    onChange={changeHandler}
                    name="bank"
                    id=""
                    value={details.bank}
                    placeholder="Account number"
                  />
                  <p>Error Meassage</p>
                </div>
                <div className="input-text">
                  <label htmlFor="transactionMethod">
                    Confirm Account Number
                  </label>

                  <input
                    onChange={changeHandler}
                    name="confirmBank"
                    id=""
                    value={details.confirmBank}
                    placeholder="Confirm Account number"
                  />
                  <p>Error Meassage</p>
                </div>
              </div>
            </div>

            <h3>Refer Code </h3>
            <div className="responsive">
              <div className="input-text">
                <label htmlFor="refered-id">Refered ID</label>
                <input
                  name="refer"
                  onChange={changeHandler}
                  id="refered-id"
                  value={details.refer}
                />
                <p>Error Meassage</p>
              </div>
              <div className="input-text">
                <label htmlFor="refered-id">Make New Refer ID</label>

                <input
                  name="setRefer"
                  onChange={changeHandler}
                  id=""
                  value={details.setRefer}
                />
                <p>Error Meassage</p>
              </div>
            </div>

            <div className="priority-order">
              <h2> priority order </h2>

              <PriorityDragable
                array={priority}
                changeHandler={changeHandler}
                details={details}
                setDetails={setDetails}
              />
            </div>
            <br />
            <br />
          </div>
          <div className="btns">
            <button type="submit">Pay</button>
            <button onClick={getPdf}>generate pdf</button>
          </div>
        </form>
      </div>
    )
  );
};

export default Signup;
