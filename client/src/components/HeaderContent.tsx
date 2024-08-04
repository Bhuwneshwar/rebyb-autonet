// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
// import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import HouseRoundedIcon from "@mui/icons-material/HouseRounded";
// import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Link } from "react-router-dom";
// import { useEffect } from "react";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import { makeProfilePic } from "../utils/functions";
import { useGlobalContext } from "../MyRedux";

console.log("location.pathname", location.pathname);
const HeaderContent: React.FC = () => {
  // useEffect(() => {
  // }, [location]);
  const {
    store: { MyDetails },
  } = useGlobalContext();
  return (
    <div className="header-content">
      {MyDetails && (
        <>
          <Link
            className={location.pathname.includes("/profile") ? "active" : ""}
            to={"/profile"}
          >
            <figure>
              <img src={makeProfilePic(MyDetails)} alt="" />
            </figure>
            {/* <AccountBalanceWalletIcon /> */}
          </Link>
          <Link
            className={
              location.pathname.includes("/payment-scanner") ? "active" : ""
            }
            to={"/payment-scanner"}
          >
            <QrCodeScannerIcon />
          </Link>
          <Link
            className={location.pathname.includes("/history") ? "active" : ""}
            to={"/history"}
          >
            <HistoryRounded />
          </Link>
          <Link
            className={location.pathname.includes("/messages") ? "active" : ""}
            to={"/messages"}
          >
            <EmailRoundedIcon />
          </Link>
          <Link
            className={location.pathname.includes("/dashboard") ? "active" : ""}
            to={"/dashboard"}
          >
            <GridViewRoundedIcon />
          </Link>
        </>
      )}

      <Link
        className={location.pathname.includes("/home") ? "active" : ""}
        to={"/home"}
      >
        <HouseRoundedIcon />
      </Link>

      {/* <AddCircleIcon /> */}
      {/* <AccountBalanceWalletIcon /> */}
      {/* <LogoutRoundedIcon /> */}
      {/* <AccountCircleIcon /> */}
      {/* <LockOpenRoundedIcon /> */}
    </div>
  );
};

export default HeaderContent;
