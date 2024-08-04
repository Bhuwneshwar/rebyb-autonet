import { Link } from "react-router-dom";
import { useGlobalContext } from "../MyRedux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
// import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import HouseRoundedIcon from "@mui/icons-material/HouseRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
// import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import HistoryRounded from "@mui/icons-material/HistoryRounded";

const Navbar = () => {
  const {
    dispatch,
    store: { nav, MyDetails },
  } = useGlobalContext();
  console.log({ nav });

  return (
    <nav
      onClick={() => dispatch("nav", false)}
      className={nav ? "navShow" : "navHide"}
    >
      <ul>
        <li>
          <Link to="/home">
            <HouseRoundedIcon />
            Home
          </Link>
        </li>
        <li>
          <Link to="/history">
            <HistoryRounded />
            History
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <GridViewRoundedIcon />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/profile">
            {" "}
            <AccountCircleIcon />
            Profile
          </Link>
        </li>
        <li>
          <Link to={"/signup/" + (MyDetails?.referCode || "")}>
            <AddCircleIcon />
            Add New User
          </Link>
        </li>
        <li>
          <Link to="/login">
            {" "}
            <LockOpenRoundedIcon />
            Sign In
          </Link>
        </li>
        <li>
          <Link to="/messages">
            {" "}
            <EmailRoundedIcon /> Message
          </Link>
        </li>
        <li>
          <Link to="/logout">
            {" "}
            <LogoutRoundedIcon />
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
