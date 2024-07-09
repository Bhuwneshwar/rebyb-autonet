import express, { Application, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import dotenv from "dotenv";
import { socketFunc } from "./middleware/Socket";
import connectDB from "./auth/connectDb";
import router from "./routers/registration";
import loginRouter from "./routers/login";
import myAccountRoute from "./routers/myAccount";
import imgRoute from "./routers/image";
import updateUserRouter from "./routers/updateUser";
import adminRoute from "./routers/admin";
import testRoute from "./routers/Test";
import cors from "cors";
import { corsOptions } from "./config/config";

import { createServer } from "http";
import { Server } from "socket.io";
// import AutoRegistration from "./controllers/forMockData/AutoRegistration";
// import { moneyManager } from "./controllers/moneyManager";
// import autoBuyFund from "./controllers/forMockData/autoBuyFunds";

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5000;
// bhuwneshwar
app.use(
  session({
    secret: process.env.SESSION || "default_secret",
    resave: false,
    saveUninitialized: true,
  })
);

const server = createServer(app);
export const io = new Server(server, {
  cors: corsOptions,
});

// app.set("socket.io", io);
app.use(cors());

// app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", router);
app.use("/api/v1", loginRouter);
app.use("/api/v1", myAccountRoute);
app.use("/api/v1", imgRoute);
app.use("/api/v1", updateUserRouter);
app.use("/api/v1", adminRoute);
app.use("/api/v1", testRoute);

app.use(express.static(path.resolve("./client/dist")));

// app.get('*', (req: Request, res: Response) => {
//   console.log('Route not defined');
//   res.sendFile(path.resolve('./client/dist/index.html'));
// });

// export let server: Server<typeof IncomingMessage, typeof ServerResponse>;

const start = async (port: string | number) => {
  try {
    server.listen(port, () => {
      console.log(`Server started http://localhost:${port}`);
    });

    const dataBaseConnected = await connectDB();
    if (dataBaseConnected) {
      if (port === 5000) {
        console.log("auto mock registrations started");
        // AutoRegistration();
        // autoBuyFund();
      } else {
        // const autoRun = setInterval(AutoRegistration, 1000 * 60 * 60 * 3);
      }
      socketFunc();
    }
  } catch (error) {
    console.log("Error on root server index.ts: ", error);
  }
};

start(port);
