import express from "express";
import { uploadCoverPic, uploadProfilePic } from "../controllers/imageUpload"; // Assuming controllers export functions
import UserAuthenticate from "../middleware/UserAuthenticate";
import multer from "multer";

const imgRoute = express.Router();

// Interface for File
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: any; // Stream of the file data
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer; // For files stored in memory
}

// Middleware to handle file type and size checks
const fileUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (
    req: express.Request,
    file: MulterFile,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only image files are allowed and less then 5mb"));
    }
  },
}).single("coverPic"); // Field name should match the expected property name in request

imgRoute
  .route("/upload-cover-pic")
  .post(fileUploadMiddleware, UserAuthenticate, uploadCoverPic);

const fileUploadMiddlewareProfile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (
    req: express.Request,
    file: MulterFile,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only image files are allowed and less then 5mb"));
    }
  },
}).single("profilePic"); // Field name should match the expected property name in request

imgRoute
  .route("/upload-profile-pic")
  .post(fileUploadMiddlewareProfile, UserAuthenticate, uploadProfilePic);

export default imgRoute;
