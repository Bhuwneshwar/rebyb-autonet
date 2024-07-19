import express from "express";
import scannerPayment from "./scanner-payment";

const combinedRoutes = express.Router();
combinedRoutes.use(scannerPayment);

export default combinedRoutes;
