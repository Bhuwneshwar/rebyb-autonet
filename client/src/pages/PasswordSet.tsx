import { ChangeEvent, useState } from "react";
import Navbar from "../components/Navbar";
import { useGlobalContext } from "../MyRedux";

const PasswordSet = () => {
  const [passwordInputs, setPasswordInputs] = useState({
    identifyId: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    method: "password",
    otp: "",
  });
  const {
    dispatch,
    store: { MyDetails },
  } = useGlobalContext();
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInputs({ ...passwordInputs, [e.target.name]: e.target.value });
  };

  // const sendOtp = async () => {
  //   try {
  //     dispatch("loading", true);
  //     const { data } = await axios.post("/api/v1/send-otp", {
  //       identifyId: loginDetails.identifyId,
  //     });
  //     console.log({ data });

  //     if (data.success) {
  //       toast.success("OTP sent successfully!", {
  //         position: "bottom-center",
  //       });

  //       setLoginDetails((prev) => ({ ...prev, otp: data.otp }));
  //     }
  //     if (data.error) {
  //       toast.error(data.error, {
  //         position: "bottom-center",
  //       });
  //     }
  //   } catch (e: any) {
  //     console.log("login : " + e);
  //     toast.error(e.message, {
  //       position: "bottom-center",
  //     });
  //   }
  //   dispatch("loading", false);
  // };
  const verifyOtp = async () => {
    // try {
    //   dispatch("loading", true);
    //   if (loginDetails.method === "password") return login();
    //   const { data } = await axios.post("/api/v1/verify-otp", {
    //     otp: String(loginDetails.otp),
    //   });
    //   console.log({ data });
    //   if (data.success) {
    //     dispatch("MyDetails", { ...MyDetails, ...data.myDetails });
    //     toast.success("Login successfully!", {
    //       position: "bottom-center",
    //     });
    //   }
    //   if (data.error) {
    //     toast.error(data.error, {
    //       position: "bottom-center",
    //     });
    //   }
    // } catch (e: any) {
    //   console.log("login : " + e);
    //   toast.error(e.message, {
    //     position: "bottom-center",
    //   });
    // }
    // dispatch("loading", false);
  };

  return (
    <div className="main">
      <Navbar />
      <div className="login-form">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>PASSWORD SET</h1>
          <div className="bg-white">
            <div className="swipe-side">
              <span>USING OTP</span>
              <div className="swipe-btn">
                <input
                  type="checkbox"
                  onChange={(e) =>
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
                <label htmlFor="identifyId">
                  Contact/ID/Email/Refer Code :{" "}
                </label>
                <input
                  type=""
                  onChange={changeHandler}
                  name="identifyId"
                  id="identifyId"
                  value={passwordInputs.identifyId}
                  placeholder="Identifier"
                />
                <p>Error Message</p>
              </div>

              <div className="input-text">
                <label htmlFor="otp">One Time Password : </label>
                <input
                  type="number"
                  onChange={changeHandler}
                  name="otp"
                  id="otp"
                  value={passwordInputs.otp}
                  placeholder="Enter OTP"
                />
                <p>Error Message</p>
              </div>
            </div>
            <div
              className={
                passwordInputs.method === "password" ? "otpMode" : "otpModeHide"
              }
            >
              <div className="input-text">
                <label htmlFor="password">old password : </label>

                <input
                  onChange={changeHandler}
                  type=""
                  name="password"
                  id="password"
                  value={passwordInputs.oldPassword}
                  placeholder="password"
                />
                <p>Error Message</p>
              </div>
            </div>
            <div className="input-text">
              <label htmlFor="password">New Password : </label>

              <input
                value={passwordInputs.newPassword}
                name="newPassword"
                onChange={changeHandler}
                type="password"
                placeholder="New Password"
              />
              <p>Error Message</p>
            </div>
            <div className="input-text">
              <label htmlFor="password">Confirm Password : </label>

              <input
                value={passwordInputs.confirmPassword}
                name="confirmPassword"
                onChange={changeHandler}
                type="password"
                placeholder="Confirm Password"
              />
              <p>Error Message</p>
            </div>
          </div>
          <br />
          <div className="btns">
            <button type="submit" onClick={verifyOtp}>
              Set Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordSet;
