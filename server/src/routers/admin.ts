import express from "express";
import { rechargeComplete, withdrawComplete } from "../controllers/admin"; // Assuming controllers export functions

const adminRoute = express.Router();

adminRoute.route("/recharge-complete").post(rechargeComplete);
adminRoute.route("/withdraw-complete").post(withdrawComplete);

export default adminRoute;
