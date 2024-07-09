import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../MyRedux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
const Login = () => {
  const {
    dispatch,
    store: { MyDetails },
  } = useGlobalContext();
  const navigate = useNavigate();

  const { url } = useParams();

  const [resData, setResData] = useState("");
  const [loginDetails, setLoginDetails] = useState({
    identifyId: "",
    password: " Strong password",
    otp: "",
    method: "password",
  });

  const onSuccess = () => {
    if (url) {
      navigate(url);
    } else {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    if (loginDetails.method === "otp") {
      sendOtp();
    }
  }, [loginDetails.method]);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };
  const sendOtp = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post("/api/v1/send-otp", {
        identifyId: loginDetails.identifyId,
      });
      console.log({ data });

      if (data.success) {
        toast.success("OTP sent successfully!", {
          position: "bottom-center",
        });

        setLoginDetails((prev) => ({ ...prev, otp: data.otp }));
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (e: any) {
      console.log("login : " + e);
      toast.error(e.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };
  const verifyOtp = async () => {
    try {
      dispatch("loading", true);
      if (loginDetails.method === "password") return login();

      const { data } = await axios.post("/api/v1/verify-otp", {
        otp: String(loginDetails.otp),
      });
      console.log({ data });

      if (data.success) {
        dispatch("MyDetails", { ...MyDetails, ...data.myDetails });
        toast.success("Login successfully!", {
          position: "bottom-center",
        });
        navigate("/dashboard");
        dispatch("role", "user");
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (e: any) {
      console.log("login : " + e);
      toast.error(e.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };
  const login = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.post("/api/v1/login", loginDetails);
      console.log({ data });

      if (data.success) {
        dispatch("MyDetails", { ...MyDetails, ...data.myDetails });
        toast.success("Login successfully!", {
          position: "bottom-center",
        });
        navigate("/dashboard");
        dispatch("role", "user");
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (e: any) {
      console.log("login : " + e);
      toast.error(e.message, {
        position: "bottom-center",
      });
    }
    dispatch("loading", false);
  };

  return (
    <div className="login-form">
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Login Form</h1>
        <div className="bg-white">
          <div className="input-text">
            <label htmlFor="identifyId">Contact/ID/Email/Refer Code : </label>
            <input
              type=""
              onChange={changeHandler}
              name="identifyId"
              id="identifyId"
              value={loginDetails.identifyId}
              placeholder="Identifier"
            />
            <p>Error Message</p>
          </div>
          <div className="swipe-side">
            <span>OTP</span>
            <div className="swipe-btn">
              <input
                type="checkbox"
                onChange={(e) =>
                  setLoginDetails({
                    ...loginDetails,
                    method:
                      loginDetails.method === "password" ? "otp" : "password",
                  })
                }
                id="swipe-btn"
                checked={loginDetails.method === "password" ? true : false}
              />
              <label htmlFor="swipe-btn"></label>
            </div>
            <span>Password</span>
          </div>

          <div
            style={{
              display: loginDetails.method === "password" ? "" : "none",
            }}
          >
            <div className="input-text">
              <label htmlFor="password">Password : </label>

              <input
                onChange={changeHandler}
                type=""
                name="password"
                id="password"
                value={loginDetails.password}
                placeholder="password"
              />
              <p>Error Message</p>
            </div>
          </div>

          <div style={{ display: loginDetails.method === "otp" ? "" : "none" }}>
            <div className="input-text">
              <label htmlFor="otp">One Time Password : </label>
              <input
                type="number"
                onChange={changeHandler}
                name="otp"
                id="otp"
                value={loginDetails.otp}
                placeholder="Enter OTP"
              />
              <p>Error Message</p>
            </div>
          </div>
        </div>
        <Link to="/signup">Signup New User</Link>
        <br />
        <div className="btns">
          <button type="submit" onClick={verifyOtp}>
            Verify & Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
