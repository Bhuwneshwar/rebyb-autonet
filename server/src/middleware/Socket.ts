import { io } from "..";
import User, { IUser } from "../models/UsersSchema"; // Assuming UsersSchema is a TypeScript interface
import { Socket } from "socket.io"; // Import specific types
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { IToken } from "../types";

interface SocketMap {
  [userId: string]: string; // Map user ID to socket ID
}

const socketIdsByUserId: SocketMap = {};

// const io = new HttpServer(server); // Create Socket.IO server instance

const socketFunc = async () => {
  io.use((socket: any, next: any) => {
    cookieParser()(socket.request, socket.request.res, async (err: any) => {
      if (err) return next(err);

      const token = socket.request.cookies.rebybfund;
      if (!token) return next(new Error("Authentication Error"));

      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as IToken;
        // Optionally, you can attach the decoded token to the socket object for further use
        // socket.decodedToken = decoded;

        console.log("try to join", socket.id);

        socketIdsByUserId[decoded.userId.toString()] = socket.id;
        // console.log(`User ${isUser.name} joined`);
        console.log({ socketIdsByUserId });

        next();
      } catch (error) {
        return next(new Error("Authentication Error"));
      }
    });
  });

  console.log("Socket.IO Server started");
  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    // io.on("join", async (token: string) => {
    //   console.log("try to join", socket.id);

    //   const isUser: IUser | null = await User.findOne({ accessToken: token });
    //   if (!isUser) {
    //     console.log("user not found");
    //     return;
    //   }

    //   socketIdsByUserId[isUser._id.toString()] = socket.id;
    //   console.log(`User ${isUser.name} joined`);
    //   console.log({ socketIdsByUserId });
    // });

    socket.on("disconnect", () => {
      const disconnectedUserId = Object.keys(socketIdsByUserId).find(
        (key) => socketIdsByUserId[key] === socket.id
      );
      if (disconnectedUserId) {
        delete socketIdsByUserId[disconnectedUserId];
        console.log(`User ${disconnectedUserId} disconnected`);
      }
    });

    console.log({ socketIdsByUserId });
  });
};

const emitMessage = (recipientId: string, message: any): boolean => {
  // Specify message type
  console.log("Received message:", message);
  const recipientSocketId = socketIdsByUserId[recipientId];

  if (recipientSocketId) {
    io.to(recipientSocketId).emit("refresh", message);
    console.log(`Sent message to user ${recipientId}`);
    return true;
  } else {
    console.log(`User ${recipientId} is not connected`);
    return false;
  }
};

export { socketFunc, socketIdsByUserId, emitMessage };
