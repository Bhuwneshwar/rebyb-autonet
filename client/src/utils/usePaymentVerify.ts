import { useGlobalContext } from "../MyRedux";
import axios from "axios";
import { toast } from "react-toastify";

interface Response {
  [key: string]: any;
}

interface PaymentVerifyResult {
  success: boolean;
  response?: any;
}

export const usePaymentVerify = () => {
  const { dispatch } = useGlobalContext();

  const paymentVerify = async (
    response: Response
  ): Promise<PaymentVerifyResult> => {
    try {
      dispatch("loading", true);
      const res = await axios.post("/api/v1/payment/verification", response, {
        withCredentials: true,
      });

      console.log({ res });
      if (res.data.success) {
        toast.success("Payment Verification successful", {
          position: "bottom-center",
        });
        dispatch("successResponseData", JSON.stringify(res.data));
        // return { success: true, response: res.data };
      }
      if (res.data.error) {
        toast.error(res.data.error, {
          position: "bottom-center",
        });
      }
    } catch (e: any) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        toast.error(e.message, { position: "bottom-center" });
      } else {
        toast.error("An unexpected error occurred", {
          position: "bottom-center",
        });
      }
    }
    dispatch("loading", false);
    return { success: false };
  };

  return { paymentVerify };
};
