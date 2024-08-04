import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { paymentUsingRazorpay } from "../utils/PaymentUsingRazorpay";
import { useGlobalContext } from "../MyRedux";
import PriorityDragable from "../components/PriorityDragable";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { toast } from "react-toastify";

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
  // const navigate = useNavigate();

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
    age: 24,
    gender: "male",
    phoneNumber: "62050",
    email: "krabi6563@gmail.com",
    phoneOtp: "",
    emailOtp: "",
    diamond: 6,
    golden: 6,
    rechNum1: "62050",
    rechNum2: "",
    rechNum3: "",
    opera1: "",
    opera2: "",
    opera3: "",
    state1: "Bihar",
    state2: "",
    state3: "",
    ExistingValidityOne: 0,
    ExistingValiditytwo: 0,
    ExistingValiditythree: 0,
    autoRecharge: true,
    transactionMethod: "none",
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
    // console.log(priority);
    setDetails((prev) => ({
      ...prev,
      priority,
    }));
  }, [data, priority]);

  const submit = async () => {
    try {
      console.log(JSON.stringify(details, null, 2));
      // alert("Submit");
      // e.preventDefault();
      dispatch("loading", true);
      const res = await axios.post(
        "/api/v1/registration",
        {
          ...details,
          age: +details.age,
          golden: +details.golden,
          diamond: +details.diamond,
          ExistingValidityOne: +details.ExistingValidityOne,
          ExistingValiditytwo: +details.ExistingValiditytwo,
          ExistingValiditythree: +details.ExistingValiditythree,
          withdraw_perc: +details.withdraw_perc,
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data: res.data });

      if (res.data.success) {
        const { key, name, email, contact, order } = res.data;

        paymentUsingRazorpay({
          key,
          name,
          email,
          contact,
          order,
          callBackFunction: paymentVerify,
        });
      }
      if (res.data.error) {
        toast.error(res.data.error, {
          position: "bottom-center",
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong! maybe invalid data", {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  const paymentVerify = async (response: any) => {
    // alert("redirecting...");
    try {
      dispatch("loading", true);
      const res = await axios.post("/api/v1/payment/verification", response, {
        withCredentials: true,
      });

      console.log({ res });
      // if (data.redirect) navigate(data.redirect);
      if (res.data.success) {
        toast.success("Registration successful", {
          position: "bottom-center",
        });
        genPdf(res.data.username);
      }
      if (res.data.error) {
        toast.error(res.data.error, {
          position: "bottom-center",
        });
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };
  const genPdf = async (identifyId: string) => {
    try {
      dispatch("loading", true);
      const { data } = await axios.get("/api/v1/pdf/" + identifyId, {
        withCredentials: true,
      });

      console.log({ data });

      if (data.success) {
        toast.success("Auto-Net card generated successfully for 1 minutes!", {
          position: "bottom-center",
        });
        const protocol = window.location.protocol;
        const hostUrl =
          protocol +
          "//" +
          window.location.hostname +
          ":" +
          data.port +
          data.path;
        console.log({ hostUrl, protocol });

        window.open(hostUrl, "_blank");

        // if (window.location.port === "3000") {
        //   // Construct the new URL without the port
        //   const newUrl =
        //     window.location.protocol +
        //     "//" +
        //     window.location.hostname +
        //     window.location.pathname +
        //     window.location.search +
        //     window.location.hash;

        //   // Redirect to the new URL
        //   window.location.href = newUrl;
        // }

        // console.log({ hostUrl }); // Output: http://localhost:3000 (or the current host)
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };
  const checkNum1 = async () => {
    try {
      if (/([5-9]{1}[0-9]{9})$/.test(details.rechNum1)) {
        const extracted = details.rechNum1.match(/([5-9]{1}[0-9]{9})$/);

        if (extracted?.length) {
          const mob = extracted[0];

          const { data } = await axios.get(`/api/v1/check/number/?mob=${mob}`);
          console.log({ data });
          // setNotify((prev) => ({
          //   ...prev,
          //   num1: data,
          // }));
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

          const { data } = await axios.get(`/api/v1/check/number/?mob=${mob}`);
          console.log({ data });
          // setNotify((prev) => ({
          //   ...prev,
          //   num2: data,
          // }));
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

          const { data } = await axios.get(`/api/v1/check/number/?mob=${mob}`);
          console.log({ data });
          // setNotify((prev) => ({
          //   ...prev,
          //   num3: data,
          // }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkNum3();
  }, [details.rechNum3]);
  const selectPlan = (opera: string) => {
    if (opera === "jio") {
      return data?.RechargePlans.jio || [];
    }
    if (opera === "airtel") {
      return data?.RechargePlans.airtel || [];
    }
    if (opera === "bsnl") {
      return data?.RechargePlans.bsnl || [];
    }
    if (opera === "mtnl delhi") {
      return data?.RechargePlans.mtnlDelhi || [];
    }
    if (opera === "mtnl mumbai") {
      return data?.RechargePlans.mtnlMumbai || [];
    }
    if (opera === "vi") {
      return data?.RechargePlans.vi || [];
    }
    return [];
  };

  useEffect(() => {
    setCurOpera1(selectPlan(details.opera1));
  }, [details.opera1]);

  useEffect(() => {
    setCurOpera2(selectPlan(details.opera2));
  }, [details.opera2]);

  useEffect(() => {
    setCurOpera3(selectPlan(details.opera3));
  }, [details.opera3]);

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

  function formatTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `Please wait: ${minutes}:${seconds} seconds`;
  }
  const [showDueTimeContact, setShowDueTimeContact] = useState("");
  let idOfTimeContact: any;
  const sendPhoneOtp = async () => {
    try {
      dispatch("loading", true);
      const res = await axios.post("/api/v1/phone/otp/send", {
        contact: details.phoneNumber,
      });
      console.log({ ...res.data });
      if (res.data.success) {
        setDetails({
          ...details,
          phoneOtp: res.data.otp,
          phoneNumber: res.data.contact,
        });
        toast.success("Otp sent successfully", {
          position: "bottom-center",
        });
      }
      if (res.data.error) {
        toast.error(res.data.error, {
          position: "bottom-center",
        });
      }
      if (res.data.dueTimeMs) {
        let dueTimeMs = res.data.dueTimeMs; // 30 seconds in milliseconds
        setShowDueTimeContact(formatTime(dueTimeMs));

        if (idOfTimeContact) clearInterval(idOfTimeContact);
        idOfTimeContact = setInterval(() => {
          dueTimeMs -= 1000;

          if (dueTimeMs < 0) {
            clearInterval(idOfTimeContact);
            setShowDueTimeContact("");
          } else {
            setShowDueTimeContact(formatTime(dueTimeMs));
          }
        }, 1000);

        toast.warning(formatTime(dueTimeMs), {
          position: "bottom-center",
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to send Otp", {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  const verifyPhoneOtp = async () => {
    try {
      dispatch("loading", true);
      const res = await axios.post("/api/v1/phone/otp/verify", {
        contact: details.phoneNumber,
        userOtp: details.phoneOtp,
      });
      console.log({ ...res.data });
      if (res.data.success) {
        toast.success("Phone verified successfully", {
          position: "bottom-center",
        });
      }
      if (res.data.warning) {
        toast.warning(res.data.warning, {
          position: "bottom-center",
        });
      }
      if (res.data.error) {
        toast.error(res.data.error, {
          position: "bottom-center",
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to Verify the phone", {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };
  const [showDueTimeEmail, setShowDueTimeEmail] = useState("");
  let idOfTimeEmail: any;
  const sendEmailOtp = async () => {
    try {
      dispatch("loading", true);
      const res = await axios.post("/api/v1/email/otp/send", {
        email: details.email,
      });
      console.log({ res: res.data });
      if (res.data.success) {
        toast.success("Otp sent successfully", {
          position: "bottom-center",
        });
        setDetails({ ...details, emailOtp: res.data.otp });
      }
      if (res.data.warning) {
        toast.warning(res.data.warning, {
          position: "bottom-center",
        });
      }
      if (res.data.error) {
        toast.error(res.data.error, {
          position: "bottom-center",
        });
      }
      if (res.data.dueTimeMs) {
        let dueTimeMs = res.data.dueTimeMs; // 30 seconds in milliseconds
        setShowDueTimeEmail(formatTime(dueTimeMs));

        if (idOfTimeEmail) clearInterval(idOfTimeEmail);
        idOfTimeEmail = setInterval(() => {
          dueTimeMs -= 1000;

          if (dueTimeMs < 0) {
            clearInterval(idOfTimeEmail);
            setShowDueTimeEmail("");
          } else {
            setShowDueTimeEmail(formatTime(dueTimeMs));
          }
        }, 1000);

        toast.warning(formatTime(dueTimeMs), {
          position: "bottom-center",
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to send Otp", {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  const verifyEmailOtp = async () => {
    try {
      dispatch("loading", true);
      const res = await axios.post("/api/v1/email/otp/verify", {
        email: details.email,
        userOtp: details.emailOtp,
      });
      console.log({ res: res.data });
      if (res.data.success) {
        toast.success("Email verified successfully", {
          position: "bottom-center",
        });
      }
      if (res.data.warning) {
        toast.warning(res.data.warning, {
          position: "bottom-center",
        });
      }
      if (res.data.error) {
        toast.error(res.data.error, {
          position: "bottom-center",
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to verify email", {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setDetails((prev) => ({
      ...prev,
      rechNum1: prev.phoneNumber,
    }));
    event.target.select();
  };
  const setArray = (newArr: string[]) => {
    setPriority(() => newArr);
  };
  return (
    data && (
      <div className="signup-form">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="bg-white">
            <h1>Signup Form </h1>
            <div className="biog">
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
              <div className="border-label">
                <label htmlFor="age">Age : </label>
                <input
                  onChange={changeHandler}
                  type="number"
                  name="age"
                  id="age"
                  value={details.age}
                  placeholder="e.g. 22.5"
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
            <div className="contact-info">
              <div className="border-label">
                <label htmlFor="number">Phone Number : </label>
                <div className="num-btn">
                  <input
                    onChange={changeHandler}
                    type="number"
                    name="phoneNumber"
                    id="number"
                    value={details.phoneNumber}
                  />
                  <button onClick={sendPhoneOtp}>
                    <ArrowForwardIos />
                  </button>
                </div>
                <p className="error">{showDueTimeContact}</p>
              </div>
              <div className="border-label">
                <label htmlFor="phoneOtp">OTP: </label>
                <div className="num-btn">
                  <input
                    name="phoneOtp"
                    onChange={changeHandler}
                    id="phoneOtp"
                    value={details.phoneOtp}
                    placeholder="Enter OTP"
                    className="otp-input"
                  />
                  <button onClick={verifyPhoneOtp}>
                    Verify
                    <ArrowForwardIos />
                  </button>
                </div>
              </div>
            </div>
            <div className="contact-info">
              <div className="border-label email">
                <label htmlFor="email">Email : </label>
                <div className="num-btn">
                  <input
                    onChange={changeHandler}
                    type="email"
                    name="email"
                    id="email"
                    value={details.email}
                  />
                  <button onClick={sendEmailOtp}>
                    {" "}
                    <ArrowForwardIos />
                  </button>
                </div>
                <p className="error">{showDueTimeEmail}</p>
              </div>
              <div className="border-label ">
                <label htmlFor="emailOtp">OTP : </label>
                <div className="num-btn">
                  <input
                    onChange={changeHandler}
                    name="emailOtp"
                    id="emailOtp"
                    value={details.emailOtp}
                    placeholder="Enter OTP"
                    className="otp-input"
                  />
                  <button onClick={verifyEmailOtp}>
                    Verify
                    <ArrowForwardIos />
                  </button>
                </div>
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
                    {details.diamond * 2000} in av. 3 months
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
                    {details.golden * 1000} in av. 3 months
                  </p>
                </div>
              </div>
              <p>
                Total Invest: {details.diamond * 1000 + details.golden * 500}{" "}
                Return: {details.golden * 1000 + details.diamond * 2000} in av.
                3 months
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
                </div>
                <div className="opera">
                  <label htmlFor="opera1"> Operator For Number 1</label>
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
                </div>
                <div className="opera">
                  <label htmlFor="state1"> State For Number 1</label>

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
                </div>
                <div className="opera">
                  <label htmlFor="SelectedPlan1">Plan For Number 1</label>

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
                </div>
                <div className="num">
                  <label htmlFor="ExistingValidityOne">
                    Existing Plan Validity 1
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
                </div>
                <div className="opera">
                  <label htmlFor="opera2"> Operator For Number 2</label>

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
                </div>
                <div className="opera">
                  <label htmlFor="state2"> State For Number 2</label>

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
                </div>
                <div className="opera">
                  <label htmlFor="SelectedPlan2">Plan For Number 2</label>
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
                </div>
                <div className="num">
                  <label htmlFor="ExistingValiditytwo">
                    Plan Validity Number 2
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
                </div>
                <div className="opera">
                  <label htmlFor="opera3"> Operator For Number 3</label>

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
                </div>
                <div className="opera">
                  <label htmlFor="state3"> State For Number 3</label>

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
                </div>
                <div className="opera">
                  <label htmlFor="SelectedPlan3">Plan For Number 3</label>

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
                </div>
                <div className="num">
                  <label htmlFor="ExistingValiditythree">
                    Existing Plan Validity 3
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
                </div>
              </div>
            </div>
            <div className="rech-for-num">
              <h2>Accounts Information</h2>
              <div className="responsive">
                <div className="select-box">
                  <label htmlFor="transactionMethod">Transaction Method</label>
                  <select
                    onChange={changeHandler}
                    value={details.transactionMethod}
                    name="transactionMethod"
                    id="transactionMethod"
                  >
                    <option value="none">None</option>
                    {data?.transactionMethods.map((method) => {
                      return <option value={method}>{method}</option>;
                    })}
                  </select>
                </div>
                <div
                  style={{
                    display:
                      details.transactionMethod === "upi" ||
                      details.transactionMethod === "both"
                        ? "block"
                        : "none",
                  }}
                  className="input-text"
                >
                  <label htmlFor="upi">UPI ID/UPI Phone Number</label>

                  <input
                    onChange={changeHandler}
                    name="upi"
                    id="upi"
                    value={details.upi}
                    placeholder="upi"
                  />
                </div>
                <div
                  style={{
                    display:
                      details.transactionMethod === "net banking" ||
                      details.transactionMethod === "both"
                        ? "block"
                        : "none",
                  }}
                  className="input-text"
                >
                  <label htmlFor="ifsc">IFSC Code</label>

                  <input
                    onChange={changeHandler}
                    name="ifsc"
                    id="ifsc"
                    value={details.ifsc}
                    placeholder="IFSC code"
                  />
                </div>
                <div
                  style={{
                    display:
                      details.transactionMethod === "net banking" ||
                      details.transactionMethod === "both"
                        ? "block"
                        : "none",
                  }}
                  className="input-text"
                >
                  <label htmlFor="account">Account Number</label>

                  <input
                    onChange={changeHandler}
                    name="bank"
                    id="account"
                    value={details.bank}
                    placeholder="Account number"
                  />
                </div>
                <div
                  style={{
                    display:
                      details.transactionMethod === "net banking" ||
                      details.transactionMethod === "both"
                        ? "block"
                        : "none",
                  }}
                  className="input-text"
                >
                  <label htmlFor="confirm-account">
                    Confirm Account Number
                  </label>

                  <input
                    onChange={changeHandler}
                    name="confirmBank"
                    id="confirm-account"
                    value={details.confirmBank}
                    placeholder="Confirm Account number"
                  />
                </div>
              </div>
            </div>

            <h3>Username Code </h3>
            <div className="responsive ">
              <div className="input-text refer-code">
                <label htmlFor="refered-id">Referral Username ID</label>
                <input
                  name="refer"
                  onChange={changeHandler}
                  id="refered-id"
                  value={details.refer}
                />
              </div>
              <div className="input-text refer-code">
                <label htmlFor="refered-id">Make New Username ID</label>

                <input
                  name="setRefer"
                  onChange={changeHandler}
                  id=""
                  value={details.setRefer}
                />
              </div>
            </div>

            <div className="priority-order">
              <h2> Priority order </h2>

              <PriorityDragable
                array={priority}
                setArray={setArray}
                changeHandler={changeHandler}
                details={details}
                setDetails={setDetails}
              />
            </div>
            <div className="btns">
              <button onClick={submit}>Pay</button>
              {/* <button onClick={getPdf}>generate pdf</button> */}
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default Signup;
