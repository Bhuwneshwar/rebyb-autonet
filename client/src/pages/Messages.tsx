import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../MyRedux";
import Chat from "./Chat";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PaymentUsingRazorpay from "../utils/PaymentUsingRazorpay";

interface UserMessages {
  name: string;
  My: any[];
  Sender: any[];
  allMessages: any[];
}

interface CanBuy {
  buyGolden: any[];
  buyDiamond: any[];
}

interface InputData {
  sdmn: number;
  buyGoldenSelected: number;
  othersGoldenSelected: number;
  buyDiamondSelected: number;
  othersDiamondSelected: number;
  fromAccount: string;
  fromAccountSendMoney: string;
  message: string;
  recievedId: string;
  User: string;
  PaidMoney: number;
  messageId: string;
  messageType: string;
  MoneyHelp?: number;
  Identifier?: string;
}

const Messages: React.FC = () => {
  const [isLongClick, setIsLongClick] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleMouseDown = () => {
    timeoutId = setTimeout(() => {
      setIsLongClick(true);
    }, 1000); // Adjust the time threshold for your long click

    // Add other logic for normal click behavior here
  };

  const handleMouseUp = () => {
    clearTimeout(timeoutId);
    if (isLongClick) {
      setIsLongClick(false);
      // Perform long click action here
    } else {
      // Perform normal click action here
    }
  };

  const {
    dispatch,
    store: { MyDetails },
  } = useGlobalContext();

  const { refer } = useParams<{ refer: string }>();
  const navigate = useNavigate();

  const [userMessages, setUserMessages] = useState<UserMessages>({
    name: "User",
    My: [],
    Sender: [],
    allMessages: [],
  });

  const [allMessage, setAllMessage] = useState<any[]>([]);

  const [canBuy, setCanBuy] = useState<CanBuy>({
    buyGolden: [],
    buyDiamond: [],
  });

  const [canBuyOthers, setCanBuyOthers] = useState<CanBuy>({
    buyGolden: [],
    buyDiamond: [],
  });

  const [input_data, setInputData] = useState<InputData>({
    sdmn: 5,
    buyGoldenSelected: 0,
    othersGoldenSelected: 0,
    buyDiamondSelected: 0,
    othersDiamondSelected: 0,
    fromAccount: "",
    fromAccountSendMoney: "",
    message: "hi",
    recievedId: "",
    User: "",
    PaidMoney: 0,
    messageId: "",
    messageType: "simpleMessage",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputData({
      ...input_data,
      [name]: value,
    });
  };

  useEffect(() => {
    initial();
  }, []);

  useEffect(() => {
    if (refer) initialMessage();
  }, [refer]);

  useEffect(() => {
    if (MyDetails?.name) {
      setCanBuy({
        buyDiamond: MyDetails.canBuyDiamond,
        buyGolden: MyDetails.canBuyGolden,
      });
    }
  }, [MyDetails, input_data, userMessages]);

  useEffect(() => {
    setInputData({
      ...input_data,
      PaidMoney:
        +input_data.buyDiamondSelected * 1000 +
        +input_data.buyGoldenSelected * 500,
    });
  }, [input_data.buyGoldenSelected, input_data.buyDiamondSelected]);

  const selectMessages = async (e: any) => {
    console.log(e.target);
  };

  const initialMessage = async () => {
    try {
      const { data } = await axios.get(`/api/messages/${refer}`, {
        withCredentials: true,
      });
      console.log(data);
      if (data.redirect) {
        navigate(data.redirect);
      }
      if (data.info) {
        const allmesg = data.mySms
          .concat(data.senderSms)
          .sort(
            (a: any, b: any) =>
              new Date(a.time).getTime() - new Date(b.time).getTime()
          );
        setUserMessages({
          name: data.info.name,
          My: data.mySms,
          Sender: data.senderSms,
          allMessages: allmesg,
        });
        setCanBuyOthers({
          buyGolden: data.info.goldenFunds,
          buyDiamond: data.info.diamondFunds,
        });
      }
    } catch (e) {
      console.log("initial error :", e);
    }
  };

  const initial = async () => {
    try {
      const { data } = await axios.get(`/api/messages`, {
        withCredentials: true,
      });
      console.log(data);
      if (data.redirect) {
        navigate(data.redirect);
      }
      if (data.names) {
        setAllMessage(data.names);
      }
    } catch (e) {
      console.log("initial error :", e);
    }
  };

  const sendMessage = async (req?: string) => {
    try {
      let msg;
      if (req === "buyFundRequest") {
        msg = JSON.stringify({
          goldenFund: input_data.buyGoldenSelected,
          diamondFund: input_data.buyDiamondSelected,
          PaidMoney: input_data.PaidMoney,
        });
      } else if (req === "send-money") {
        msg = JSON.stringify({
          sendable: input_data.sdmn,
        });
      } else if (req === "buy-Fund-for-user") {
        msg = JSON.stringify({
          goldenFund: input_data.othersGoldenSelected,
          diamondFund: input_data.othersDiamondSelected,
          buyFundForUser: true,
        });
      } else {
        msg = input_data.message;
      }
      alert(msg);
      const { data } = await axios.post(
        `/api/message`,
        {
          Message: msg,
          recieverId: refer,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
    } catch (e) {
      console.log("checkFunds error :", e);
    }
  };

  const join = async () => {
    try {
      const { data } = await axios.post(
        `/api/message/join`,
        {
          user: input_data.User,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data.referCode) {
        navigate("/messages/" + data.referCode);
      }
    } catch (e) {
      console.log("checkFunds error :", e);
    }
  };

  const sendMoney = async () => {
    try {
      console.log({
        kitna: input_data.sdmn,
        kisko: refer,
        kahase: input_data.fromAccountSendMoney,
      });
      const { data } = await axios.post(
        "/api/v1/account-send-money",
        {
          kitna: input_data.sdmn,
          kisko: refer,
          kahase: input_data.fromAccountSendMoney,
        },
        {
          withCredentials: true,
        }
      );

      console.log(data);
      if (data.redirect) {
        navigate(data.redirect);
      }
      if (data.updated) {
        setUserMessages((prev) => ({ ...prev, ...data.updated }));
      }
      const { payNow, key, name, email, contact, order } = data;
      if (payNow) {
        PaymentUsingRazorpay({
          key,
          name,
          email,
          contact,
          order,
          callfuntion: checkFunds,
        });
      } else {
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkFunds = async () => {
    try {
      const { data } = await axios.get(
        `/api/other-check-funds/${input_data.Identifier ?? null}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data.canBuyDiamond) {
        setCanBuy({
          buyDiamond: data.canBuyDiamond,
          buyGolden: data.canBuyGolden,
        });
      }
    } catch (e) {
      console.log("checkFunds error :", e);
    }
  };

  const buyForother = async () => {
    try {
      const { data } = await axios.post(
        `/api/add-other-funds`,
        {
          buyGoldenSelected: input_data.othersGoldenSelected,
          buyDiamondSelected: input_data.othersDiamondSelected,
          fromAccount: input_data.fromAccount,
          identifyMe: refer,
          MoneyHelp: input_data.MoneyHelp,
          messageId: input_data.messageId,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data.canBuyDiamond) {
        setCanBuy({
          buyDiamond: data.canBuyDiamond,
          buyGolden: data.canBuyGolden,
        });
      }
      if (data.updated) {
        setUserMessages((prev) => ({ ...prev, ...data.updated }));
      }
      const { FunName, success, key, name, email, contact, order } = data;
      if (success) {
        PaymentUsingRazorpay({
          key,
          name,
          email,
          contact,
          order,
          callfuntion: paymentVerifyOthers,
          funName: "nahiPata",
        });
      } else {
        console.log(data);
      }

      //end
    } catch (e) {
      console.log("buyForother error :", e);
    }
  };

  const paymentVerifyOthers = async (response: any, FunName?: string) => {
    alert("redirecting...");
    try {
      const { data } = await axios.post(
        "/api/v1/account/payment/verification/add/others/funds",
        { ...response, FunName },
        {
          withCredentials: true,
        }
      );

      console.log(data);
      if (data.redirect) navigate(data.redirect);
      if (data.updated) {
        setUserMessages((prev) => ({ ...prev, ...data.updated }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const readyForOther = (reqSms: any, messageId: string) => {
    setInputData({
      ...input_data,
      MoneyHelp: reqSms.PaidMoney,
      othersDiamondSelected: reqSms.diamondFund,
      othersGoldenSelected: reqSms.goldenFund,
      messageId,
    });
  };

  return refer && MyDetails ? (
    <Chat
      userMessages={userMessages}
      Balance={MyDetails.Balance}
      newMessage={MyDetails.newMessage}
      canBuy={canBuy}
      canBuyOthers={canBuyOthers}
      sendMoney={sendMoney}
      buyForother={buyForother}
      handleMouseDown={handleMouseDown}
      handleMouseUp={handleMouseUp}
      refer={refer}
      handleChange={handleChange}
      input_data={input_data}
      sendMessage={sendMessage}
    />
  ) : (
    <div id="messages">
      <div className="container">
        <h2>Messages</h2>
        <div className="join-box">
          <input type="text" placeholder="Refer Code/ID/Phone Number/Email" />
          <button onClick={join}>
            <ArrowForwardIosIcon />
          </button>
        </div>
        <div className="chats">
          {allMessage.map((user) => (
            <div
              className="lastMessage"
              key={user.referCode}
              onClick={(e) => navigate("/messages/" + user.referCode)}
            >
              <figure>
                <img
                  src="https://th.bing.com/th/id/OIP.vAuCou6PorBYkntC17e0QAAAAA?rs=1&pid=ImgDetMain"
                  alt={user.name}
                />
              </figure>
              <div className="info">
                <h3>{user.name}</h3>
                <span>{"static msg"} </span>
              </div>
              <div className="time">
                <div>12:00 AM</div>
                <span>10</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
