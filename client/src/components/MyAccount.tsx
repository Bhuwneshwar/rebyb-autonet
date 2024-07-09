// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useGlobalContext } from "../Hooks/AppContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

const MyAccount = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard");
  }, []);
  return null;
  // const { newMesssge, updateState, MyDetails } = useGlobalContext();
  // console.log("newMesssge", newMesssge);
  // const [data, setData] = useState(null);

  // //const [fromAccount, setFromAccount] = useState("balance");
  // const [send_box, setSendBox] = useState(false);
  // const [input_data, setInputData] = useState({
  //   sdmn: 5,
  //   contactidemail: 6205085598,
  //   topup: "10",
  //   withDraw: "10",
  //   rechargePlan: 250,
  //   rechNumber: "",
  //   golden: "0",
  //   diamond: "0",

  //   prevPass: "",
  //   currentPass: "",
  //   name: "",
  //   age: "",
  //   gender: "",
  //   email: "",
  //   Identifier: "6205085599",
  //   buyGoldenSelected: "0",
  //   buyDiamondSelected: "0",
  //   fromAccount: "",
  //   fromAccountSendMoney: "",
  //   message: "",
  //   recievedId: "",
  //   referCode: "",
  // });
  // const handleChange = (e) => {
  //   let { name, value } = e.target;
  //   setInputData({
  //     ...input_data,
  //     [name]: value,
  //   });
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);
  // useEffect(() => {}, [newMesssge]);
  // useEffect(() => {
  //   console.log(data);
  //   if (data) {
  //     handleChange({ target: { name: "referCode", value: data.referCode } });
  //   }
  // }, [data]);

  // const fetchData = async () => {
  //   try {
  //     const { data } = await axios.get("/api/myaccount", {
  //       withCredentials: true,
  //     });

  //     console.log(data);
  //     console.log(data.redirect);
  //     if (data.redirect) {
  //       return navigate(data.redirect);
  //     }
  //     setData(data);
  //     updateState("Balance", data.Balance);

  //     // Cleanup on unmount
  //     return () => {
  //       socket.disconnect();
  //     };
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const changePassword = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       "/api/v1/change-password",
  //       { prevPass: input_data.prevPass, currentPass: input_data.currentPass },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     console.log(data);
  //     if (data.redirect) {
  //       navigate(data.redirect);
  //     }
  //     // setData(data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const setReferCode = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       "/api/v1/account-refer",
  //       { referCode: input_data.referCode },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     console.log(data);
  //     if (data.redirect) {
  //       navigate(data.redirect);
  //     }
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //     // setData(data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const genReferCode = async () => {
  //   try {
  //     const { data } = await axios.get("/api/account-refer", {
  //       withCredentials: true,
  //     });

  //     console.log(data);
  //     if (data.redirect) {
  //       navigate(data.redirect);
  //     }
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //     if (data.referCode) {
  //       handleChange({ target: { name: "referCode", value: data.referCode } });
  //     }
  //     // setData(data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const paymentVerifySendMoney = async (response) => {
  //   try {
  //     const { data } = await axios.post(
  //       "/api/v1/account/payment/verification/sendMoney",
  //       response,
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     // save the PDF file

  //     console.log(data);
  //     if (data.redirect) navigate(data.redirect);
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //   } catch (e) {
  //     console.log("paymentVerifySendMoney error :", e);
  //   }
  // };
  // const paymentVerify = async (response) => {
  //   alert("redirecting...");
  //   try {
  //     const { data } = await axios.post(
  //       "/api/v1/account/payment/verification",
  //       response,
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     // save the PDF file

  //     console.log(data);
  //     if (data.redirect) navigate(data.redirect);
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const paymentVerifyAddFunds = async (response) => {
  //   alert("redirecting...");
  //   try {
  //     const { data } = await axios.post(
  //       "/api/v1/account/payment/verification/add/funds",
  //       response,
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     // save the PDF file

  //     console.log(data);
  //     if (data.redirect) navigate(data.redirect);
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const topup = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       "/api/v1/account-topup",
  //       { amount: input_data.topup },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     console.log(data);
  //     if (data.redirect) {
  //       navigate(data.redirect);
  //     }
  //     const { success, key, name, email, contact, order } = data;
  //     if (success) {
  //       const options = {
  //         key, // Enter the Key ID generated from the Dashboard
  //         amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //         currency: "INR",
  //         name: "RebyB Fund 5",
  //         description: "Test Transaction",
  //         image: "https://example.com/your_logo",

  //         order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  //         //callback_url: "/api/v1/payment/verification",
  //         handler: function (response) {
  //           //alert(response.razorpay_payment_id);
  //           //alert(response.razorpay_order_id);
  //           //alert(response.razorpay_signature);
  //           paymentVerify(response);
  //         },
  //         prefill: {
  //           name,
  //           email,
  //           contact,
  //         },
  //         notes: {
  //           address: "Razorpay Corporate Office",
  //         },
  //         theme: {
  //           color: "#3399cc",
  //         },
  //       };
  //       const razor = new window.Razorpay(options);
  //       razor.open();

  //       razor.on("payment.failed", function (response) {
  //         alert(response.error.code);
  //         alert(response.error.description);
  //         alert(response.error.source);
  //         alert(response.error.step);
  //         alert(response.error.reason);
  //         alert(response.error.metadata.order_id);
  //         alert(response.error.metadata.payment_id);
  //       });
  //     } else {
  //       console.log(data);
  //     } //setData(data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const withDraw = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       "/api/v1/account-withdraw",
  //       { amount: input_data.withDraw },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //     console.log(data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const rechargeNow = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       "/api/v1/account-recharge",
  //       {
  //         contact: input_data.rechNumber,
  //         rechargePlan: input_data.rechargePlan,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     console.log(data);
  //     if (data.updated) {
  //       setData(data.updated);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const buyNow = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       "/api/v1/account-invest",
  //       {
  //         golden: input_data.golden,
  //         diamond: input_data.diamond,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     console.log(data);

  //     const { success, key, name, email, contact, order } = data;
  //     if (success) {
  //       const options = {
  //         key, // Enter the Key ID generated from the Dashboard
  //         amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //         currency: "INR",
  //         name: "RebyB Fund 5",
  //         description: "Test Transaction",
  //         image: "https://example.com/your_logo",
  //         order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  //         //callback_url: "/api/v1/payment/verification",
  //         handler: function (response) {
  //           //alert(response.razorpay_payment_id);
  //           //alert(response.razorpay_order_id);
  //           //alert(response.razorpay_signature);
  //           paymentVerifyAddFunds(response);
  //         },
  //         prefill: {
  //           name,
  //           email,
  //           contact,
  //         },
  //         notes: {
  //           address: "Razorpay Corporate Office",
  //         },
  //         theme: {
  //           color: "#3399cc",
  //         },
  //       };
  //       const razor = new window.Razorpay(options);
  //       razor.open();

  //       razor.on("payment.failed", function (response) {
  //         alert(response.error.code);
  //         alert(response.error.description);
  //         alert(response.error.source);
  //         alert(response.error.step);
  //         alert(response.error.reason);
  //         alert(response.error.metadata.order_id);
  //         alert(response.error.metadata.payment_id);
  //       });
  //     } else {
  //       console.log(data);
  //     }

  //     //end
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // {
  //   return data ? (
  //     <>
  //       <div id="my_account">
  //         <div>{data.name}</div>
  //         <div>{data.Balance}</div>
  //         <div>{data.RegisteredAt}</div>
  //         <div>{data.age}</div>
  //         <div>{data.contact}</div>
  //         <div>{data.email}</div>
  //         <div>{data.gender}</div>
  //         <div>{data._id}</div>
  //         <div
  //           onClick={(e) => navigate("/messages/" + data.lastMesssge.referCode)}
  //         >
  //           <h3>{data.lastMesssge.name}</h3>
  //           <h4>{data.lastMesssge.message} </h4>
  //         </div>
  //         <div className="newMesssge">{newMesssge}</div>

  //         <button onClick={(e) => navigate("/signup")}>Add New User</button>
  //         <div className={send_box ? "send_box" : ""}>
  //           <h5>Available Balance : {data.Balance}</h5>

  //           <br />
  //           <input
  //             onChange={handleChange}
  //             name="topup"
  //             id=""
  //             value={input_data.topup}
  //           />
  //           <button onClick={topup}>TopUp</button>
  //           <br />
  //           <br />
  //           <input
  //             onChange={handleChange}
  //             name="withDraw"
  //             placeholder="Enter Amount "
  //             id=""
  //             value={input_data.withDraw}
  //           />
  //           <button onClick={withDraw}>Withdraw</button>
  //           <br />
  //           <br />
  //           <select
  //             onChange={handleChange}
  //             value={input_data.rechNumber}
  //             name="rechNumber"
  //             id="rechargeNums"
  //           >
  //             <option value="0">select contact</option>
  //             {data.rechNums.map((ob, i) => {
  //               return (
  //                 <option key={i} value={ob.rechNumber}>
  //                   {ob.rechNumber}
  //                 </option>
  //               );
  //             })}
  //           </select>
  //           <input
  //             name="rechargePlan"
  //             onChange={handleChange}
  //             id=""
  //             value={input_data.rechargePlan}
  //           />
  //           <button onClick={rechargeNow}>Recharge Now</button>
  //           <br />
  //           <br />
  //           <select
  //             name="golden"
  //             value={input_data.golden}
  //             onChange={handleChange}
  //             id=""
  //           >
  //             <option value="0">Select Golden fund</option>
  //             {data.canBuyGolden.map((v, i) => {
  //               return <option value={v}>{v + " X"}</option>;
  //             })}
  //           </select>
  //           <select
  //             value={input_data.diamond}
  //             name="diamond"
  //             onChange={handleChange}
  //             id=""
  //           >
  //             <option value="0">Select Diamond fund</option>
  //             {data.canBuyDiamond.map((v, i) => {
  //               return <option value={v}>{v + " X"}</option>;
  //             })}
  //           </select>
  //           <button onClick={buyNow}>
  //             Buy : {input_data.diamond * 1000 + input_data.golden * 500}
  //           </button>
  //           <br />

  //           <br />
  //           <h3 onClick={(e) => navigate("/messages")}>
  //             Messages <span></span>
  //           </h3>
  //           <br />
  //           <br />
  //           {data.password ? (
  //             <>
  //               <input
  //                 name="prevPass"
  //                 id=""
  //                 onChange={handleChange}
  //                 value={input_data.prevPass}
  //                 placeholder="Enter previous Password"
  //               />
  //               <input
  //                 name="currentPass"
  //                 id=""
  //                 onChange={handleChange}
  //                 value={input_data.currentPass}
  //                 placeholder="New Password"
  //               />
  //             </>
  //           ) : (
  //             <input
  //               name="currentPass"
  //               id=""
  //               onChange={handleChange}
  //               value={input_data.currentPass}
  //               placeholder="New Password"
  //             />
  //           )}
  //           <button onClick={changePassword}>
  //             {data.password ? "Change Password" : "Set password"}
  //           </button>
  //           <br />
  //           <br />
  //           <div id="updateBox">
  //             <h2>Account Update</h2>
  //             <input
  //               name="name"
  //               id=""
  //               onChange={handleChange}
  //               value={data.name}
  //               placeholder="Name"
  //             />

  //             <br />
  //             <br />
  //             <h3>Set Refer Code</h3>
  //             <input
  //               onChange={handleChange}
  //               name="referCode"
  //               id=""
  //               value={input_data.referCode}
  //             />
  //             <button onClick={genReferCode}> Generate Refer Code</button>
  //             <button onClick={setReferCode}> Set Refer Code</button>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   ) : (
  //     "Loading..."
  //   );
  // }
};

export default MyAccount;
