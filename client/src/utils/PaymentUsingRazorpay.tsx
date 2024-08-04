// import axios from "axios";
// import { useGlobalContext } from "../MyRedux";
// import { toast } from "react-toastify";

interface Order {
  id: string;
  amount: number;
}

interface PaymentUsingRazorpayProps {
  key: string;
  name: string;
  email: string;
  contact: string;
  order: Order;
  callBackFunction: (response: any, funName?: string) => void;
  funName?: string;
}

export const paymentUsingRazorpay = ({
  key,
  name,
  email,
  contact,
  order,
  callBackFunction,
  funName,
}: PaymentUsingRazorpayProps) => {
  const options = {
    key, // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "RebyB Fund 5",
    description: "Test Transaction",
    image:
      "https://th.bing.com/th/id/OIP.vAuCou6PorBYkntC17e0QAAAAA?rs=1&pid=ImgDetMain",
    order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response: any) {
      console.log({ response });
      // paymentVerify(response);
      callBackFunction(response, funName);
    },
    prefill: {
      name,
      email,
      contact,
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const razor = new (window as any).Razorpay(options);
  razor.open();

  razor.on("payment.failed", function (response: any) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
  });
};

// export const usePaymentVerify = () => {
//   const { dispatch } = useGlobalContext();

//   const paymentVerify = async (response: string) => {
//     try {
//       alert("verifying...");
//       dispatch("loading", true);
//       const res = await axios.post("/api/v1/payment/verification", response, {
//         withCredentials: true,
//       });

//       console.log({ res });
//       if (res.data.success) {
//         toast.success("Payment Verification successful", {
//           position: "bottom-center",
//         });
//         return { success: true, response: res.data };
//       }
//       if (res.data.error) {
//         toast.error(res.data.error, {
//           position: "bottom-center",
//         });
//       }
//     } catch (e) {
//       console.log(e);
//       if (axios.isAxiosError(e)) {
//         toast.error(e.message, { position: "bottom-center" });
//       } else {
//         toast.error("An unexpected error occurred", {
//           position: "bottom-center",
//         });
//       }
//     }
//     dispatch("loading", false);
//   };

//   return { paymentVerify };
// };

// export const paymentVerify = async (response: any) => {
//   const { dispatch } = useGlobalContext();
//   try {
//     alert("verifying...");
//     dispatch("loading", true);
//     const res = await axios.post("/api/v1/payment/verification", response, {
//       withCredentials: true,
//     });

//     console.log({ res });
//     // if (data.redirect) navigat6e(data.redirect);
//     if (res.data.success) {
//       toast.success("Payment Verification successful", {
//         position: "bottom-center",
//       });
//       return { success: true, response: res.data };
//       // genPdf(res.data.username);
//     }
//     if (res.data.error) {
//       toast.error(res.data.error, {
//         position: "bottom-center",
//       });
//     }
//   } catch (e: any) {
//     console.log(e);
//     if (axios.isAxiosError(e)) {
//       toast.error(e.message, { position: "bottom-center" });
//     } else {
//       toast.error("An unexpected error occurred", {
//         position: "bottom-center",
//       });
//     }
//   }
//   dispatch("loading", false);
// };
