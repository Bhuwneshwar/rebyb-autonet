import { useEffect, useState } from "react";
import { useGlobalContext } from "../MyRedux";
import axios from "axios";
import { toast } from "react-toastify";
import { Expenses, Incomes } from "../MyRedux/Store";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { formatDate } from "../utils/formatDate";
import ShareIcon from "@mui/icons-material/Share";
import { formatNumber } from "../utils/functions";
// import UpgradeIcon from "@mui/icons-material/Upgrade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SendIcon from "@mui/icons-material/Send";
import AutoModeIcon from "@mui/icons-material/AutoMode";
interface HistoryItem {
  date: Date;
  type: string;
  increment: boolean;
  // Include other common fields for history items
  [key: string]: any;
}

const History = () => {
  const {
    dispatch,
    store: { MyDetails },
  } = useGlobalContext();

  const [expenses, setExpenses] = useState<Expenses | undefined>();
  const [incomes, setIncomes] = useState<Incomes | undefined>();
  const [recent, setRecent] = useState<HistoryItem[]>([]);

  console.log({ expenses, incomes, recent });

  const initial = async () => {
    try {
      dispatch("loading", true);
      const { data } = await axios.get("/api/v1/history", {
        withCredentials: true,
      });
      console.log("history loaded", { data });

      if (data.success) {
        setExpenses(data.expenses);
        setIncomes(data.incomes);
        toast.success("History loaded successfully", {
          position: "bottom-center",
        });
      } else if (data.error) {
        toast.error(data.error, { position: "bottom-center" });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message, { position: "bottom-center" });
      } else {
        toast.error("An unexpected error occurred", {
          position: "bottom-center",
        });
      }
      console.log(error);
    }
    dispatch("loading", false);
  };

  useEffect(() => {
    initial();
  }, []);

  useEffect(() => {
    if (incomes && expenses) {
      const list: HistoryItem[] = [];

      expenses.invest.forEach((invest) => {
        list.push({
          ...invest,
          type: "invest",
          increment: false,
        });
      });
      expenses.userSend.forEach((send) => {
        list.push({
          ...send,
          type: "send",
          increment: false,
        });
      });
      expenses.withdrawOnBank.forEach((withdraw) => {
        list.push({
          ...withdraw,
          type: "withdraw",
          increment: false,
        });
      });
      expenses.recharge.forEach((recharge) => {
        list.push({
          ...recharge,
          type: "recharge",
          increment: false,
        });
      });
      //incomes
      incomes.referralAmount.forEach((referral) => {
        list.push({
          ...referral,
          type: "referral",
          increment: true,
        });
      });
      incomes.topupAmount.forEach((topUp) => {
        list.push({
          ...topUp,
          type: "topUp",
          increment: true,
        });
      });
      incomes.userAmount.forEach((user) => {
        list.push({
          ...user,
          type: "userMoney",
          increment: true,
        });
      });

      //sort by date ascending
      const historyList = list.sort((a, b) => {
        const first = new Date(a.date);
        const second = new Date(b.date);
        return first.getTime() - second.getTime();
      });

      console.log({ historyList });
      setRecent(() => historyList);
    }
  }, [incomes, expenses]);

  return (
    <div className="history">
      {recent.map((obj) => {
        return (
          <div
            key={obj._id}
            className={
              obj.increment ? "recent-history income" : "recent-history expense"
            }
          >
            <div className="ids">
              <figure>
                {/* <img
                  src="https://cdn-icons-png.flaticon.com/512/65/65581.png"
                  alt="profile Pic"
                /> */}
                <p>{obj.name[0]}</p>
              </figure>
              <div className="info">
                <div className="names">
                  <p className="paid">
                    {obj.increment ? "Received From" : "Paid to"}
                  </p>
                  <p className="name">{obj.name}</p>
                </div>
                <div className="amount">
                  <p>
                    ₹{formatNumber(obj.amount)} {obj.increment ? "(+)" : "(-)"}
                  </p>
                  <p className="type">
                    {obj.type === "invest" && (
                      <>
                        <AutoModeIcon />
                        {obj.type}
                      </>
                    )}
                    {obj.type === "send" && (
                      <>
                        <SendIcon />
                        {obj.type}
                      </>
                    )}
                    {obj.type === "withdraw" && (
                      <>
                        <AccountBalanceIcon />
                        {obj.type}
                      </>
                    )}
                    {obj.type === "recharge" && (
                      <>
                        <MobileFriendlyIcon />
                        {obj.type}
                      </>
                    )}
                    {obj.type === "referral" && (
                      <>
                        <ShareIcon />
                        {obj.type}
                      </>
                    )}
                    {obj.type === "topUp" && (
                      <>
                        <AccountBalanceWalletIcon />
                        {obj.type}
                      </>
                    )}
                    {obj.type === "userMoney" && (
                      <>
                        <CallReceivedIcon />
                        {obj.type}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="dates">
              <p className="date"> {formatDate(obj.date)}</p>
              <p className="from">
                {obj.increment ? "Credited to" : "Debited from"}
                <AccountBalanceWalletIcon />
                {/* <AccountBalanceIcon /> */}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default History;
