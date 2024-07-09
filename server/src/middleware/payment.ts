import { Request, Response } from "express";
import crypto from "crypto";
import Temporary from "../models/Temporary";
import register from "../OnPayment/register";
import dotenv from "dotenv";

dotenv.config();

const paymentVerification = async (req: Request, res: Response) => {
  try {
    let signatureIsValid = false;
    let signature: string;
    let paymentId: string;
    let orderId: string;

    if (
      req?.body?.razorpay_order_id &&
      req?.body?.razorpay_payment_id &&
      req?.body?.razorpay_signature
    ) {
      // Request from client
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
      // Request from Razorpay webhook
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
      res.status(200).send("ok");
    } else {
      return res
        .status(400)
        .send({ success: false, message: "Invalid request" });
    }

    if (signatureIsValid) {
      const temp = await Temporary.findOne({ id: orderId });
      if (!temp) {
        return res.status(201).send("Already processed");
      }

      console.log("Temporary data found:", temp);

      const { FunName } = temp;

      if (FunName === "register") {
        await register(req, res, temp, orderId, paymentId, signature);
      }
      await temp.deleteOne();
    } else {
      return res.status(400).send("Invalid signature");
    }
  } catch (e: any) {
    console.error("Error in payment verification:", e);
    return res.status(500).send({ error: e.message });
  }
};

export default paymentVerification;
