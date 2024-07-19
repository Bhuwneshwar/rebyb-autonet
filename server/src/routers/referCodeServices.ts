import express from "express";
import { test, testPost } from "../controllers/Test"; // Assuming Test exports functions
import AutoRegistration from "../controllers/forMockData/AutoRegistration"; // Assuming AutoRegistration is a function

const referCodeServices = express.Router();

referCodeServices.route("/account-by-referCode").get(testPost);

export default referCodeServices;
