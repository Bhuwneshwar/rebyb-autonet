import { Link } from "react-router-dom";
import { useGlobalContext } from "../MyRedux";

const Navbar = () => {
  const {
    store: { nav },
  } = useGlobalContext();
  console.log({ nav });

  return (
    <nav className={nav ? "navShow" : "navHide"}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/signup">Add New User</Link>
        </li>
        <li>
          <Link to="/login">Sign In</Link>
        </li>
        <li>
          <Link to="/messages">Message</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
