import express from "express";
import { test, testPost } from "../controllers/Test"; // Assuming Test exports functions
import AutoRegistration from "../controllers/forMockData/AutoRegistration"; // Assuming AutoRegistration is a function

const testRoute = express.Router();

testRoute.route("/test").post(testPost).get(test);
testRoute.route("/AutoRegistration").get(AutoRegistration);

export default testRoute;
