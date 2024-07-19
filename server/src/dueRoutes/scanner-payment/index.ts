import express, { Response, Request } from "express";
import identification from "../../middleware/identification";
import UserAuthenticate from "../../middleware/UserAuthenticate";
import { IReq } from "../../types";

const accountByReferCode = async (req: IReq, res: Response) => {
  try {
    const { referCode } = req.params;
    console.log("Received refer", referCode);

    if (!referCode) {
      return res.send({ error: "Refer code is required" });
    }
    if (typeof referCode !== "string") {
      return res.send({ error: "Refer code is invalid!" });
    }
    if (!req.rootUser) {
      return res.send({ error: "please login", redirect: "/login" });
    }

    const identified = await identification(referCode, req.rootUser);

    if (!identified.doc) {
      return res.send({ error: "Invalid refer code" });
    }

    const { name } = identified.doc;

    res.send({
      success: true,
      user: { name, myMaxMoney: req.rootUser.Balance },
    });
  } catch (error) {
    console.log(error);
    res.send({ error: "Invalid" });
  }
};

const scannerPayment = express.Router();
scannerPayment
  .route("/account-by-referCode/:referCode")
  .get(UserAuthenticate, accountByReferCode);
export default scannerPayment;
