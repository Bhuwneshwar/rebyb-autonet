import { useEffect, useState } from "react";
import QRCodeScanner from "../utils/QRCodeScanner";
import { useGlobalContext } from "../MyRedux";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentScanner = () => {
  const { dispatch } = useGlobalContext();
  const [referCode, setReferCode] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [myMaxMoney, setMyMaxMoney] = useState<number>(1000);
  const updateScannedData = (data: string) => {
    console.log({ data });
    setReferCode(data);
  };
  const getAccount: any = async (referCode?: string) => {
    dispatch("loading", true);
    try {
      const encodedReferCode = encodeURIComponent(referCode || "");

      const { data } = await axios.get(
        "/api/v1/account-by-referCode/" + encodedReferCode,
        {
          withCredentials: true,
        }
      );
      console.log({ data });

      if (data.success) {
        setName(data.user.name);
        setMyMaxMoney(data.user.myMaxMoney);
      }
      if (data.error) {
        toast.error(data.error, {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      toast.error(error.message, { position: "bottom-center" });
    }
    dispatch("loading", false);
  };
  useEffect(() => {
    if (referCode) {
      getAccount(referCode);
    }
  }, [referCode]);

  return (
    <div>
      {/* <button onClick={getAccount}>get account</button> */}
      {referCode ? (
        <div>
          <h5>{name}</h5>
          <h6>{referCode}</h6>
          <div>
            <input
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              max={myMaxMoney}
              type="number"
              placeholder="Amount..."
              style={
                amount > myMaxMoney
                  ? {
                      border: "2px solid red",
                      color: "red",
                      outline: "1px solid red",
                    }
                  : { border: "black", color: "black" }
              }
            />
            <button>Pay</button>
          </div>
        </div>
      ) : (
        <div className="scanner">
          <QRCodeScanner
            title="Payment Scanner"
            style={{
              maxWidth: "20rem",
              maxHeight: "20rem",
              border: "1px solid #fff",
            }}
            scannedDataUpdater={updateScannedData}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentScanner;
