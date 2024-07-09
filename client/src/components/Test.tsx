import { useEffect } from "react";
import axios from "axios";
const Test = () => {
  useEffect(() => {
    start();
  }, []);
  const start = async () => {
    const { data } = await axios.post("api/test", {
      name: "Bhuwneshwar Mandal ",
      age: "555 ",
    });

    console.log(data);
  };
  return <h1>vgu</h1>;
};

export default Test;
