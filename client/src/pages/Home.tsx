import { toast } from "react-toastify";
import Footer from "../components/Footer";
import SlideableDiv from "../components/Dragging";
import hero from "../assets/Screenshot 2024-07-09 110058.png";
const Home = () => {
  console.log({ toast });
  const notify = () => {
    toast.success("This is a success message!", {
      position: "bottom-left", // Use string values for position
      autoClose: 10000, // 10 seconds
    });
    toast.error("This is an error message!", {
      // position: toast.POSITION.BOTTOM_LEFT,
      autoClose: false, // manually close
    });
    toast.info("This is an info message!", {
      // position: toast.POSITION.TOP_CENTER,
    });
    toast.warn("This is a warning message!", {
      // position: toast.POSITION.BOTTOM_CENTER,
    });
  };

  // Position Property: The position property should be a string. Valid options include "top-left", "top-right", "top-center", "bottom-left", "bottom-right", and "bottom-center".

  return (
    <div className="App">
      <img src={hero} alt="df" />

      <h1>React Toastify Example</h1>
      <button onClick={notify}>Show Toast Messages</button>
      <SlideableDiv />
      <Footer />
    </div>
  );
};

export default Home;
