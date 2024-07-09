import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      // confirm logout
      const yes = confirm("Are you sure you want to logout?");
      if (!yes) {
        //back to previous page
        if (history.length > 1) {
          history.go(-1);
        } else {
          navigate("/");
        }
        return;
      }

      // Logout request to the server
      const res = await axios.get("/api/logout", {
        withCredentials: true,
      });

      console.log(res);
      if (typeof res.data === "string") {
        toast.info(res.data, {
          position: "bottom-center",
        });
      }
      if (res.data.redirect) {
        navigate(res.data.redirect);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div id="logout">
        <h1>Logout in...</h1>
      </div>
    </>
  );
};

export default Logout;
