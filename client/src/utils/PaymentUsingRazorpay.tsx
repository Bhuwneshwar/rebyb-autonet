import { useEffect } from "react";

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
  callfuntion: (response: any, funName?: string) => void;
  funName?: string;
}

const PaymentUsingRazorpay = ({
  key,
  name,
  email,
  contact,
  order,
  callfuntion,
  funName,
}: PaymentUsingRazorpayProps) => {
  useEffect(() => {
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
        callfuntion(response, funName);
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
  }, [key, name, email, contact, order, callfuntion]);

  return null; // No need to return anything from this component
};

export default PaymentUsingRazorpay;
