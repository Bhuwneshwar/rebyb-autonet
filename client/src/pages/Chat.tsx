import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useGlobalContext } from "../MyRedux";
import SendIcon from "@mui/icons-material/Send";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "axios";
import { paymentUsingRazorpay } from "../utils/PaymentUsingRazorpay";
import { toast } from "react-toastify";

interface ChatProps {
  userMessages: {
    allMessages: Array<{ id: number; message: string; align: string }>;
    name: string;
  };
  Balance: number;
  newMessage: string;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  input_data: {
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
  };
  sendMessage: (req?: string) => void;
  canBuy: {
    buyDiamond: number[];
    buyGolden: number[];
  };
  canBuyOthers: {
    buyDiamond: number[];
    buyGolden: number[];
  };
  sendMoney: () => void;
  buyForother: () => void;
  handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (e: MouseEvent<HTMLDivElement>) => void;
  refer: string;
}

const Chat: React.FC<ChatProps> = ({
  userMessages,
  Balance,
  newMessage,
  handleChange,
  input_data,
  sendMessage,
  canBuy,
  canBuyOthers,
  sendMoney,
  buyForother,

  refer,
}) => {
  const {
    dispatch,
    store: { activeMsgTab },
  } = useGlobalContext();
  const [userMessagesData, setUserMessagesData] = useState({
    name: "",
    profileImg: "",
    onActive: "",
  });

  const [messages, setMessages] = useState([]);

  const sendMoneyFromBalance = async () => {
    try {
      alert("active");
      const { data } = await axios.post(
        "/api/v1/account-send-money",
        {
          kitna: input_data.sdmn,
          kisko: refer,
          kahase: "balance",
        },
        {
          withCredentials: true,
        }
      );

      console.log({ data });
      if (typeof data === "string") {
        toast.info(data, {
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const sendMoneyFromBank = async () => {
    try {
      alert("bank");
      const { data } = await axios.post(
        "/api/v1/account-send-money",
        {
          kitna: input_data.sdmn,
          kisko: refer,
          kahase: "account",
        },
        {
          withCredentials: true,
        }
      );

      console.log({ data });
      if (typeof data === "string") {
        toast.info(data, {
          position: "bottom-center",
        });
      }
      const { contact, key, email, name, order, payNow } = data;
      if (payNow) {
        paymentUsingRazorpay({
          key,
          name,
          email,
          contact,
          order,
          callfuntion: () => {},
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const initialMessage = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.get(`/api/v1/messages/${refer}`, {
        withCredentials: true,
      });
      console.log({ data });
      if (data.success) {
        setUserMessagesData({
          name: data.name,
          profileImg: data.profileImg,
          onActive: data.onActive,
        });
        setMessages(data.messages);
      }
      if (data.error) {
      }
      // if (data.redirect) {
      //   navigate(data.redirect);
      // }
      // if (data.info) {
      //   const allmesg = data.mySms
      //     .concat(data.senderSms)
      //     .sort(
      //       (a: any, b: any) =>
      //         new Date(a.time).getTime() - new Date(b.time).getTime()
      //     );
      //   setUserMessages({
      //     name: data.info.name,
      //     My: data.mySms,
      //     Sender: data.senderSms,
      //     allMessages: allmesg,
      //   });
      //   setCanBuyOthers({
      //     buyGolden: data.info.goldenFunds,
      //     buyDiamond: data.info.diamondFunds,
      //   });
      // }
    } catch (e: any) {
      console.log("initial error :", e);
      toast.error(e.message, { position: "bottom-center" });
    }
    dispatch("loading", false);
  };
  useEffect(() => {
    initialMessage();
  }, []);
  return (
    <div className="chat">
      <div className="lastMessage">
        <figure>
          <img src={userMessagesData.profileImg} alt={"icon"} />
        </figure>
        <div className="info">
          <h3>{userMessagesData.name}</h3>
        </div>
        <div className="time">
          {/* <span>Active</span> */}
          <div>{userMessagesData.onActive}</div>
        </div>
      </div>
      <div className="chating">
        <div>
          {messages.map((sms: any) => {
            let reqSms: any = {};
            try {
              reqSms = JSON.parse(sms.message);
              console.log(reqSms);
            } catch (error) {
              console.log({ error });
            }
            return (
              <div
                className="msg-chat"
                style={{ "--align": sms.align } as React.CSSProperties}
                key={sms.id}
              >
                {reqSms.PaidMoney ? (
                  <div className="msg req-buy-funds">
                    <p>Request Buy Funds</p>
                    <table>
                      <thead>
                        <tr>
                          <th> Fund's name</th>
                          <th>mul</th>
                          <th>op..</th>
                          <th>value</th>
                          <th>equel</th>
                          <th>total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="g">
                          <th>Golden Fund</th>
                          <td>{reqSms.goldenFund}</td>
                          <td>X</td>
                          <td>500</td>
                          <td>=</td>
                          <td>{reqSms.goldenFund * 500}</td>
                        </tr>
                        <tr className="d">
                          <th>Diamond Fund</th>
                          <td>{reqSms.diamondFund}</td>
                          <td>X</td>
                          <td>1000</td>
                          <td>=</td>
                          <td>{reqSms.diamondFund * 1000}</td>
                        </tr>
                        <tr className="t">
                          <th>Paid</th>
                          <td>
                            {reqSms.diamondFund * 1000 +
                              reqSms.goldenFund * 500}
                          </td>
                          <td>-</td>
                          <td>{reqSms.PaidMoney}</td>
                          <td>=</td>
                          <td>
                            {reqSms.diamondFund * 1000 +
                              reqSms.goldenFund * 500 -
                              reqSms.PaidMoney}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button
                      disabled={
                        reqSms.diamondFund * 1000 +
                          reqSms.goldenFund * 500 -
                          reqSms.PaidMoney <=
                        0
                      }
                    >
                      {reqSms.diamondFund * 1000 +
                        reqSms.goldenFund * 500 -
                        reqSms.PaidMoney}
                      /- Pay & Give
                    </button>
                  </div>
                ) : reqSms.sendable ? (
                  <div className="money-recieved">
                    <p>Recieved Money</p>
                    <div className="rupee">
                      <CurrencyRupeeIcon />
                      {reqSms.sendable}/-
                    </div>
                  </div>
                ) : reqSms.buyFundForUser ? (
                  <div className="msg recieved-funds">
                    <p>Received Funds</p>
                    <table>
                      <thead>
                        <tr>
                          <th> Fund's name</th>
                          <th>qu..</th>
                          <th>op..</th>
                          <th>value</th>
                          <th>equel</th>
                          <th>invest</th>
                          <th>Return</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="g">
                          <th>Golden Fund</th>
                          <td>{reqSms.goldenFund}</td>
                          <td>X</td>
                          <td>500</td>
                          <td>=</td>
                          <td>{reqSms.goldenFund * 500}</td>
                          <td>{reqSms.goldenFund * 500 * 2}</td>
                        </tr>
                        <tr className="d">
                          <th>Diamond Fund</th>
                          <td>{reqSms.diamondFund}</td>
                          <td>X</td>
                          <td>1000</td>
                          <td>=</td>
                          <td>{reqSms.diamondFund * 1000}</td>
                          <td>{reqSms.diamondFund * 1000 * 2}</td>
                        </tr>
                        <tr className="t">
                          <th>Total</th>
                          <td>{reqSms.goldenFund + reqSms.diamondFund}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            {reqSms.goldenFund * 500 +
                              reqSms.diamondFund * 1000}
                          </td>
                          <td>
                            {reqSms.goldenFund * 500 +
                              reqSms.diamondFund * 1000 * 2}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    onDoubleClick={() => alert("Double Cliked")}
                    className="msg-text"
                    style={{ background: "skyblue" }}
                  >
                    {" "}
                    {/* <input type="checkbox" name="msgs[]" id="" /> */}
                    {sms.message}{" "}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="action-btns">
        <div className="actions">
          {activeMsgTab === "simple-msg" ? (
            <div className="simple-msg">
              <textarea
                name="newMessage"
                onChange={handleChange}
                value={newMessage}
                placeholder="Message Here"
              ></textarea>
              <button onClick={() => sendMessage()}>
                <SendIcon />
              </button>
            </div>
          ) : activeMsgTab === "send-money" ? (
            <div className="send-money">
              <div>
                <label htmlFor="amount">Enter Amount</label>

                <div className="rupee">
                  <CurrencyRupeeIcon />
                  <input
                    name="sdmn"
                    type="text"
                    id="amount"
                    value={input_data.sdmn}
                    placeholder="99.00"
                    onChange={handleChange}
                    max={200}
                    min={0}
                  />
                </div>
              </div>

              <button onClick={sendMoneyFromBalance}>
                from balance
                <SendIcon />
              </button>
              <button onClick={sendMoneyFromBank}>
                from bank
                <SendIcon />
              </button>
            </div>
          ) : activeMsgTab === "buy-funds" ? (
            <div className="buy-funds-req">
              <div>
                <p>Select Funds</p>
                <label>
                  Golden Funds
                  <select
                    name="buyGoldenSelected"
                    value={input_data.buyGoldenSelected}
                    onChange={handleChange}
                  >
                    <option value="">Choose..</option>
                    {canBuy.buyGolden.map((v, i) => (
                      <option value={v} key={i}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Diamond Funds
                  <select
                    name="buyDiamondSelected"
                    value={input_data.buyDiamondSelected}
                    onChange={handleChange}
                  >
                    <option value="">Choose..</option>
                    {canBuy.buyDiamond.map((v, i) => (
                      <option value={v} key={i}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button onClick={() => sendMessage("buy")}>
                {" "}
                Send Buy Fund Request <SendIcon />
              </button>
            </div>
          ) : activeMsgTab === "send-money-others" ? (
            <div className="send-money-others">
              <div>
                <p>Select Funds</p>
                <label>
                  Golden Funds
                  <select
                    name="othersGoldenSelected"
                    value={input_data.othersGoldenSelected}
                    onChange={handleChange}
                  >
                    <option value="">Choose..</option>
                    {canBuyOthers.buyGolden.map((v, i) => (
                      <option value={v} key={i}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Diamond Funds
                  <select
                    name="othersDiamondSelected"
                    value={input_data.othersDiamondSelected}
                    onChange={handleChange}
                  >
                    <option value="">Choose..</option>
                    {canBuyOthers.buyDiamond.map((v, i) => (
                      <option value={v} key={i}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  <p>Enter Money</p>
                  <input
                    type="text"
                    name="fromAccountSendMoney"
                    value={input_data.fromAccountSendMoney}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <button onClick={buyForother}>Send Money</button>
            </div>
          ) : activeMsgTab === "send-help" ? (
            <div className="send-help">
              <div>
                <p>Enter Amount</p>
                <label>
                  Money
                  <input
                    type="text"
                    name="MoneyHelp"
                    value={input_data.MoneyHelp}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  From Account
                  <input
                    type="text"
                    name="fromAccount"
                    value={input_data.fromAccount}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <button onClick={sendMoney}>Send Money</button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="tabs">
          <button
            className={activeMsgTab === "simple-msg" ? "active" : ""}
            onClick={(e) => dispatch("activeMsgTab", "simple-msg")}
          >
            simple Message
          </button>
          <button
            className={activeMsgTab === "send-money" ? "active" : ""}
            onClick={(e) => dispatch("activeMsgTab", "send-money")}
          >
            Send Money
          </button>
          <button
            className={activeMsgTab === "buy-funds" ? "active" : ""}
            onClick={(e) => dispatch("activeMsgTab", "buy-funds")}
          >
            Send Buy Fund Request
          </button>
          <button
            className={activeMsgTab === "send-help" ? "active" : ""}
            onClick={(e) => dispatch("activeMsgTab", "send-help")}
          >
            Buy Fund For User
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
