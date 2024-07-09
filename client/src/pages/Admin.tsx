import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Contact {
  number?: string;
  state?: string;
  operator?: string;
  plan?: number;
  UserId?: string;
}

interface Withdraw {
  transactionMethod?: string;
  upi?: string;
  ifsc?: string;
  bank?: number;
  Amount?: number;
  UserId?: string;
}

interface AdminData {
  _id: string;
  Type: string;
  UserId: string;
  number?: string;
  plan?: number;
  transactionMethod?: string;
  upi?: string;
  ifsc?: string;
  bank?: number;
  Amount?: number;
  state: string;
  operator: string;
}

const Admin: React.FC = () => {
  const [model, setModel] = useState<boolean>(true);
  const [model2, setModel2] = useState<boolean>(true);
  const [contact, setContact] = useState<Contact>({
    number: "",
    state: "",
    operator: "",
    plan: 0,
    UserId: "",
  });
  const [withdraw, setWithdraw] = useState<Withdraw>({
    transactionMethod: "",
    upi: "",
    ifsc: "",
    bank: 0,
    Amount: 0,
    UserId: "",
  });

  useEffect(() => {
    setModel(!model);
  }, [contact]);

  useEffect(() => {
    setModel2(!model2);
  }, [withdraw]);

  const navigate = useNavigate();

  const perform = ({ UserId, number, state, operator, plan }: AdminData) => {
    setContact((prev) => {
      return {
        ...prev,
        number,
        plan,
        state,
        operator,
        UserId,
      };
    });
  };

  const perform2 = ({
    UserId,
    Amount,
    transactionMethod,
    upi,
    ifsc,
    bank,
  }: AdminData) => {
    setWithdraw((prev) => ({
      ...prev,
      transactionMethod,
      Amount,
      ifsc,
      bank,
      UserId,
      upi,
    }));
  };

  const getAll = async () => {
    try {
      const res = await axios.get("/api/v1/admin");

      console.log("Users", res.data.user);
      console.log("golden ", res.data.golden);
      console.log("diamond ", res.data.diamond);
    } catch (e) {
      console.log(e);
    }
  };

  const [data, setData] = useState<AdminData[] | null>(null);

  useEffect(() => {
    fetchData();
  }, [model, model2]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/api/v1/admin-work");
      console.log(data);
      if (typeof data === "string") {
        toast.info(data, {
          position: "bottom-center",
        });
      }
      setData(data);
    } catch (e) {
      console.log(e);
    }
  };

  const rechComp = async (id?: string, number?: string, plan?: number) => {
    try {
      const { data } = await axios.post("/api/v1/recharge-complete", {
        id,
        number,
        plan,
      });
      console.log(data);
      if (typeof data === "string") {
        toast.info(data, {
          position: "bottom-center",
        });
      }
      if (data) {
        setModel(!model);
      }
    } catch (e) {
      console.log("rechComp error :", e);
    }
  };

  const withdComp = async (id?: string, Amount?: number, Method?: string) => {
    try {
      const { data } = await axios.post("/api/v1/withdraw-complete", {
        id,
        Amount,
        Method,
      });
      console.log(data);
      if (data.success) {
        setModel2(!model2);
      }
    } catch (e) {
      console.log("withdComp error :", e);
    }
  };

  return data ? (
    <>
      <div id="my_account">
        <div className={model ? "modelBox " : "modelBox hidden"}>
          <h2>Recharge </h2>
          <h3>Contact : {contact.number} </h3>
          <h3>Operator : {contact.operator} </h3>
          <h3>Plan : {contact.plan} </h3>
          <h3>State : {contact.state} </h3>
          <button onClick={() => setModel(!model)}>Recharge later </button>
          <button
            onClick={() =>
              rechComp(contact.UserId, contact.number, contact.plan)
            }
          >
            Recharge Complete
          </button>
        </div>
        <div className={model2 ? "modelBox" : "modelBox hidden"}>
          <h2>Send Money </h2>
          <h3>Amount : {Math.floor(withdraw.Amount || 0)} </h3>
          <h3>Method : {withdraw.transactionMethod} </h3>
          <h3>Upi : {withdraw.upi} </h3>
          <h3>IFSC : {withdraw.ifsc} </h3>
          <h3>ACCOUNT NUMBER : {withdraw.bank} </h3>
          <button onClick={() => setModel2(!model2)}>Send Money later </button>
          <button
            onClick={() =>
              withdComp(
                withdraw.UserId,
                withdraw.Amount,
                withdraw.transactionMethod
              )
            }
          >
            Money Sent Complete
          </button>
        </div>
        <button onClick={getAll}>Get all data</button>
        <button onClick={() => navigate("/signup")}>Add New User</button>
        {data.map((elem) => {
          const {
            _id,
            Type,

            number,
            plan,

            Amount,
          } = elem;
          if (Type === "recharge") {
            return (
              <div key={_id}>
                <span>{number} </span>
                <span>{plan} </span>
                <button onClick={() => perform(elem)}>{Type} </button>
              </div>
            );
          }
          if (Type === "sendMoney") {
            return (
              <div key={_id} className="">
                <span>{Math.floor(Amount || 0)} </span>
                <button onClick={() => perform2(elem)}>{Type} </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  ) : (
    "Loading..."
  );
};

export default Admin;
