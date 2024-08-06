import { Request, Response } from "express";
import crypto from "crypto";
import Temporary from "../models/Temporary";
import register from "../OnPayment/register";
import dotenv from "dotenv";
import buyFunds from "../controllers/buyFunds";
import { topUpComplete } from "../controllers/Account";
import PaymentHistory from "../models/paymentSuccessSchema";
import Transaction from "../models/historySchema";

// Load environment variables
dotenv.config();

const paymentVerification = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    let signatureIsValid = false;
    let signature: string;
    let paymentId: string;
    let orderId: string;

    if (
      req?.body?.razorpay_order_id &&
      req?.body?.razorpay_payment_id &&
      req?.body?.razorpay_signature
    ) {
      // Client-side request
      orderId = req.body.razorpay_order_id;
      paymentId = req.body.razorpay_payment_id;
      signature = req.body.razorpay_signature;

      const body = orderId + "|" + paymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET as string)
        .update(body)
        .digest("hex");

      console.log("Signature received from client:", signature);
      console.log("Generated signature from client:", expectedSignature);

      signatureIsValid = expectedSignature === signature;
    } else if (
      req?.headers["x-razorpay-signature"] &&
      req?.body?.payload?.payment?.entity?.order_id &&
      req?.body?.payload?.payment?.entity?.id
    ) {
      // Razorpay webhook request
      orderId = req.body.payload.payment.entity.order_id;
      paymentId = req.body.payload.payment.entity.id;
      signature = req.headers["x-razorpay-signature"] as string;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.SECRET as string)
        .update(JSON.stringify(req.body))
        .digest("hex");

      console.log("Signature received from Razorpay:", signature);
      console.log("Generated signature from Razorpay:", expectedSignature);

      signatureIsValid = expectedSignature === signature;
      // res.status(200).send("ok");
    } else {
      return res
        .status(400)
        .send({ success: false, message: "Invalid request" });
    }

    if (signatureIsValid) {
      const newPaymentHistory = await PaymentHistory.create({
        paymentId,
        signature,
        orderId,
      });

      // Add your logic for fund allocation here if needed

      // const wait = (ms: number) => {
      //   setTimeout(() => {
      //     console.log("Waited for " + ms / 1000 + " seconds.");
      //   }, ms);
      // };
      // wait(1000);

      const temp = await Temporary.findOne({ id: orderId });
      console.log({ temp });

      if (!temp) {
        return res
          .status(201)
          .send({ success: true, message: "Already processed" });
      }

      await PaymentHistory.findByIdAndUpdate(newPaymentHistory._id, {
        userId: temp.UserId,
        amount: temp.amount,
      });

      console.log("Temporary data found:", temp);

      const { FunName } = temp;
      await temp.deleteOne();

      if (FunName === "register") {
        await register(req, res, temp);
      }
      if (FunName === "buyFunds") {
        const invested = await buyFunds(
          req,
          res,
          temp.golden,
          temp.diamond,
          temp.UserId
        );
        if (invested.success) {
          const addedExpensesInvest = await Transaction.create({
            golden: temp.golden,
            diamond: temp.diamond,
            amount: temp.amount,
            from: "account",
            date: Date(),
            category: "expense",
            subcategory: "invest",
            userId: temp.UserId,
          });
          console.log({ addedExpensesInvest });
          res.send({ ...invested, type: "invested-from-account" });
        }
      }
      if (FunName === "top-up") {
        topUpComplete(req, res, temp.amount, temp.UserId);
      }
      // res.status(200).send("ok");
    } else {
      return res.status(400).send("Invalid signature");
    }
  } catch (e: any) {
    console.error("Error in payment verification:", e);
    return res.status(500).send({ error: e.message });
  }
};

export default paymentVerification;
