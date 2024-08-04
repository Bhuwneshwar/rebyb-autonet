import express from "express";
import scannerPayment from "./scanner-payment";
import dashboardRoute from "./dashboard";
import historyRoute from "./history";
import setPasswordRoute from "./set-password";

const combinedRoutes = express.Router();
combinedRoutes.use(scannerPayment);
combinedRoutes.use(dashboardRoute);
combinedRoutes.use(historyRoute);
combinedRoutes.use(setPasswordRoute);

export default combinedRoutes;
