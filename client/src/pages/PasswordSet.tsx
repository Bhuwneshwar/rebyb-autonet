import { ChangeEvent, useEffect, useState } from "react";
import { useGlobalContext } from "../MyRedux";
import axios from "axios";
import { toast } from "react-toastify";
function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `Please wait: ${minutes}:${seconds} seconds`;
}
const PasswordSet = () => {
  const {
    dispatch,
    store: { MyDetails },
  } = useGlobalContext();
  const [passwordInputs, setPasswordInputs] = useState({
    // identifyId: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    method: "password",
    otp: "",
  });
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInputs({ ...passwordInputs, [e.target.name]: e.target.value });
  };
  const [BalancePinInputs, setBalancePinInputs] = useState({
    // identifyId: "",
    oldBalancePin: "",
    newBalancePin: "",
    confirmBalancePin: "",
    method: "BalancePin",
    otp: "",
  });
  const BalancePinChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log({ e });

    setBalancePinInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [showDueTime, setShowDueTime] = useState("");
  let idOfTime: any;

  const sendOtp = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.get("/api/v1/send-otp", {
        withCredentials: true,
      });
      console.log({ data });

      if (data.success) {
        toast.success(data.message, {
          position: "bottom-center",
        });

        setPasswordInputs((prev) => ({ ...prev, otp: data.otp }));
      }
      if (data.wait) {
        let dueTimeMs = data.wait; // 30 seconds in milliseconds
        setShowDueTime(formatTime(dueTimeMs));

        if (idOfTime) clearInterval(idOfTime);
        idOfTime = setInterval(() => {
          dueTimeMs -= 1000;

          if (dueTimeMs < 0) {
            clearInterval(idOfTime);
            setShowDueTime("");
          } else {
            setShowDueTime(formatTime(dueTimeMs));
          }
        }, 1000);

        toast.warning(formatTime(dueTimeMs), {
          position: "bottom-center",
        });
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
  useEffect(() => {
    if (passwordInputs.method === "otp") {
      sendOtp();
    }
  }, [passwordInputs.method]);
  const verifyOtp = async () => {
    try {
      dispatch("loading", true);
      // if (loginDetails.method === "password") return login();
      const { data } = await axios.post("/api/v1/account/verify-otp", {
        otp: passwordInputs.otp,
        verifyReason: "set-password",
      });
      console.log({ data });
      if (data.success) {
        // dispatch("MyDetails", { ...MyDetails, ...data.myDetails });
        toast.success("OTP verified successfully!", {
          position: "bottom-center",
        });
      }

      if (data.wait) {
        let dueTimeMs = data.wait; // 30 seconds in milliseconds
        setShowDueTime(formatTime(dueTimeMs));

        if (idOfTime) clearInterval(idOfTime);
        idOfTime = setInterval(() => {
          dueTimeMs -= 1000;

          if (dueTimeMs < 0) {
            clearInterval(idOfTime);
            setShowDueTime("");
          } else {
            setShowDueTime(formatTime(dueTimeMs));
          }
        }, 1000);

        toast.warning(formatTime(dueTimeMs), {
          position: "bottom-center",
        });
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

  const changePassword = async () => {
    try {
      if (passwordInputs.newPassword !== passwordInputs.confirmPassword) {
        return toast.error("New password and confirm password do not match", {
          position: "bottom-center",
        });
      }

      dispatch("loading", true);

      const { data } = await axios.post(
        "/api/v1/change-password",
        {
          oldPassword: passwordInputs.oldPassword,
          newPassword: passwordInputs.newPassword,
          confirmPassword: passwordInputs.confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      console.log({ data });
      if (data.success) {
        toast.success("Password change successfully", {
          position: "bottom-center",
        });
        setPasswordInputs((prev) => ({
          ...prev,
          newPassword: "",
          oldPassword: "",
          confirmPassword: "",
        }));
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
  const setPassword = async () => {
    try {
      // if (passwordInputs.newPassword !== passwordInputs.confirmPassword) {
      //   return toast.error("New password and confirm password do not match", {
      //     position: "bottom-center",
      //   });
      // }

      dispatch("loading", true);

      const { data } = await axios.post(
        "/api/v1/set-password",
        {
          newPassword: passwordInputs.newPassword,
          confirmPassword: passwordInputs.confirmPassword,
          verifyReason: "set-password",
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        toast.success("Password set successfully", {
          position: "bottom-center",
        });
        if (MyDetails) {
          dispatch("MyDetails", { ...MyDetails, password: data.password });
        }
        setPasswordInputs((prev) => ({
          ...prev,
          newPassword: "",
          oldPassword: "",
          confirmPassword: "",
        }));
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

  const [showDueTimeBalancePin, setShowDueTimeBalancePin] = useState("");
  let idOfTimeBalancePin: any;

  const sendOtpBalancePin = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.get("/api/v1/send-otp", {
        withCredentials: true,
      });
      console.log({ data });

      if (data.success) {
        toast.success(data.message, {
          position: "bottom-center",
        });

        setBalancePinInputs((prev) => ({ ...prev, otp: data.otp }));
      }
      if (data.wait) {
        let dueTimeMs = data.wait; // 30 seconds in milliseconds
        setShowDueTimeBalancePin(formatTime(dueTimeMs));

        if (idOfTimeBalancePin) clearInterval(idOfTimeBalancePin);
        idOfTimeBalancePin = setInterval(() => {
          dueTimeMs -= 1000;

          if (dueTimeMs < 0) {
            clearInterval(idOfTimeBalancePin);
            setShowDueTimeBalancePin("");
          } else {
            setShowDueTimeBalancePin(formatTime(dueTimeMs));
          }
        }, 1000);

        toast.warning(formatTime(dueTimeMs), {
          position: "bottom-center",
        });
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
  useEffect(() => {
    if (BalancePinInputs.method === "otp") {
      sendOtpBalancePin();
    }
  }, [BalancePinInputs.method]);
  const verifyOtpBalancePin = async () => {
    try {
      dispatch("loading", true);
      // if (loginDetails.method === "password") return login();
      const { data } = await axios.post("/api/v1/account/verify-otp", {
        otp: BalancePinInputs.otp,
        verifyReason: "set-balance-pin",
      });
      console.log({ data });
      if (data.success) {
        // dispatch("MyDetails", { ...MyDetails, ...data.myDetails });
        toast.success("OTP verified successfully!", {
          position: "bottom-center",
        });
      }

      if (data.wait) {
        let dueTimeMs = data.wait; // 30 seconds in milliseconds
        setShowDueTimeBalancePin(formatTime(dueTimeMs));

        if (idOfTimeBalancePin) clearInterval(idOfTimeBalancePin);
        idOfTimeBalancePin = setInterval(() => {
          dueTimeMs -= 1000;

          if (dueTimeMs < 0) {
            clearInterval(idOfTimeBalancePin);
            setShowDueTimeBalancePin("");
          } else {
            setShowDueTimeBalancePin(formatTime(dueTimeMs));
          }
        }, 1000);

        toast.warning(formatTime(dueTimeMs), {
          position: "bottom-center",
        });
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

  const changeBalancePin = async () => {
    try {
      // if (passwordInputs.newPassword !== passwordInputs.confirmPassword) {
      //   return toast.error("New password and confirm password do not match", {
      //     position: "bottom-center",
      //   });
      // }

      dispatch("loading", true);

      const { data } = await axios.post(
        "/api/v1/change-balance-pin",
        {
          oldBalancePin: BalancePinInputs.oldBalancePin,
          newBalancePin: BalancePinInputs.newBalancePin,
          confirmBalancePin: BalancePinInputs.confirmBalancePin,
        },
        {
          withCredentials: true,
        }
      );

      console.log({ data });
      if (data.success) {
        toast.success("Balance PIN change successfully", {
          position: "bottom-center",
        });
        setBalancePinInputs((prev) => ({
          ...prev,
          newBalancePin: "",
          oldBalancePin: "",
          confirmBalancePin: "",
        }));
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
  const setBalancePin = async () => {
    try {
      // if (passwordInputs.newPassword !== passwordInputs.confirmPassword) {
      //   return toast.error("New password and confirm password do not match", {
      //     position: "bottom-center",
      //   });
      // }

      dispatch("loading", true);

      const { data } = await axios.post(
        "/api/v1/set-balance-pin",
        {
          newBalancePin: BalancePinInputs.newBalancePin,
          confirmBalancePin: BalancePinInputs.confirmBalancePin,
          verifyReason: "set-balance-pin",
        },
        {
          withCredentials: true,
        }
      );
      console.log({ data });
      if (data.success) {
        toast.success("Balance PIN set successfully", {
          position: "bottom-center",
        });
        if (MyDetails) {
          dispatch("MyDetails", {
            ...MyDetails,
            balancePin: data.BalancePin,
          });
        }
        setBalancePinInputs((prev) => ({
          ...prev,
          oldBalancePin: "",
          newBalancePin: "",
          confirmBalancePin: "",
          otp: "",
        }));
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

  return (
    <div className="main set-password">
      {/* <Navbar /> */}
      <div className="login-form">
        <form onSubmit={(e) => e.preventDefault()}>
          <h2> SET PASSWORD</h2>
          <div className="bg-white">
            <div className="swipe-side">
              <span>USING OTP</span>
              <div className="swipe-btn">
                <input
                  type="checkbox"
                  onChange={() =>
                    setPasswordInputs({
                      ...passwordInputs,
                      method:
                        passwordInputs.method === "password"
                          ? "otp"
                          : "password",
                    })
                  }
                  id="swipe-btn"
                  checked={passwordInputs.method === "password" ? true : false}
                />
                <label htmlFor="swipe-btn"></label>
              </div>
              <span>USING PASSWORD</span>
            </div>
            <div
              className={
                passwordInputs.method === "otp" ? "otpMode" : "otpModeHide"
              }
            >
              <div className="input-text">
                <label htmlFor="otp">One Time Password : </label>
                <input
                  type="number"
                  onChange={changeHandler}
                  name="otp"
                  id="otp"
                  onBlur={verifyOtp}
                  value={passwordInputs.otp}
                  placeholder="Enter OTP"
                />
                <p className="otp-timer">{showDueTime}</p>
              </div>
            </div>
            <div
              className={
                passwordInputs.method === "password" ? "otpMode" : "otpModeHide"
              }
            >
              <div className="input-text">
                <label htmlFor="password">Old password : </label>

                <input
                  onChange={changeHandler}
                  type="password"
                  name="oldPassword"
                  id="password"
                  value={passwordInputs.oldPassword}
                  placeholder="password"
                />
              </div>
            </div>
            <div className="input-text">
              <label htmlFor="newPassword">New Password : </label>

              <input
                value={passwordInputs.newPassword}
                name="newPassword"
                onChange={changeHandler}
                type="password"
                id="newPassword"
                placeholder="New Password"
              />
            </div>
            <div className="input-text">
              <label htmlFor="confirmPassword">Confirm Password : </label>

              <input
                value={passwordInputs.confirmPassword}
                name="confirmPassword"
                onChange={changeHandler}
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
              />
            </div>
          </div>
          <br />
          <div className="btns">
            <button
              type="submit"
              onClick={() =>
                passwordInputs.method === "otp"
                  ? setPassword()
                  : changePassword()
              }
            >
              Set Password
            </button>
          </div>
        </form>
        <hr />
        <br />
        <br />
        <form onSubmit={(e) => e.preventDefault()}>
          <h2> SET BALANCE PIN</h2>
          <div className="bg-white">
            <div className="swipe-side">
              <span>USING OTP</span>
              <div className="swipe-btn">
                <input
                  type="checkbox"
                  onChange={() =>
                    setBalancePinInputs({
                      ...BalancePinInputs,
                      method:
                        BalancePinInputs.method === "BalancePin"
                          ? "otp"
                          : "BalancePin",
                    })
                  }
                  id="swipe-btnBalancePin"
                  checked={
                    BalancePinInputs.method === "BalancePin" ? true : false
                  }
                />
                <label htmlFor="swipe-btnBalancePin"></label>
              </div>
              <span>USING BALANCE PIN</span>
            </div>
            <div
              className={
                BalancePinInputs.method === "otp" ? "otpMode" : "otpModeHide"
              }
            >
              <div className="input-text">
                <label htmlFor="otpB">One Time Password : </label>
                <input
                  type="number"
                  onChange={BalancePinChangeHandler}
                  name="otp"
                  id="otpB"
                  onBlur={verifyOtpBalancePin}
                  value={BalancePinInputs.otp}
                  placeholder="Enter OTP"
                />
                <p>{showDueTimeBalancePin}</p>
              </div>
            </div>
            <div
              className={
                BalancePinInputs.method === "BalancePin"
                  ? "otpMode"
                  : "otpModeHide"
              }
            >
              <div className="input-text">
                <label htmlFor="passwordB">Old Balance Pin : </label>

                <input
                  onChange={BalancePinChangeHandler}
                  type="password"
                  name="oldBalancePin"
                  id="passwordB"
                  value={BalancePinInputs.oldBalancePin}
                  placeholder="Balance Pin"
                />
              </div>
            </div>
            <div className="input-text">
              <label htmlFor="newBalancePin">New Balance Pin : </label>

              <input
                value={BalancePinInputs.newBalancePin}
                name="newBalancePin"
                onChange={BalancePinChangeHandler}
                type="password"
                id="newBalancePin"
                placeholder="New Balance PIN"
              />
            </div>
            <div className="input-text">
              <label htmlFor="confirmBalancePin">Confirm Balance Pin : </label>

              <input
                value={BalancePinInputs.confirmBalancePin}
                name="confirmBalancePin"
                onChange={BalancePinChangeHandler}
                type="password"
                id="confirmBalancePin"
                placeholder="Confirm Balance PIN"
              />
            </div>
          </div>
          <br />
          <div className="btns">
            <button
              type="submit"
              onClick={() =>
                BalancePinInputs.method === "otp"
                  ? setBalancePin()
                  : changeBalancePin()
              }
            >
              Set Balance PIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordSet;
