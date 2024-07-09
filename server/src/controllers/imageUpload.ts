import { Request, Response } from "express";
import cloudinary from "../config/cloudinaryConfig";
import streamifier from "streamifier";
import User from "../models/UsersSchema";
import { IReq } from "../types";

const uploadCoverPic = async (req: IReq, res: Response) => {
  try {
    // Example validation checks using express-validator's body()

    const streamUpload = (req: IReq) => {
      return new Promise((resolve, reject) => {
        const newFileName = `coverPic_${req.userId}`;
        let uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "userCoverPics",
            public_id: newFileName,
            resource_type: "auto",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
      });
    };

    const uploadedImage: any = await streamUpload(req);
    console.log({ uploadedImage });
    const updatedCoverPic = await User.findByIdAndUpdate(
      req.userId,
      {
        coverImg: uploadedImage.secure_url,
      },
      { new: true }
    );
    if (updatedCoverPic) {
      res.send({ coverImg: updatedCoverPic.coverImg, success: true });
    } else {
      res.send({ error: "Error updating cover" });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: "File upload failed" });
  }
};

const uploadProfilePic = async (req: IReq, res: Response) => {
  try {
    // Example validation checks using express-validator's body()

    const streamUpload = (req: IReq) => {
      return new Promise((resolve, reject) => {
        const newFileName = `ProfilePic_${req.userId}`;
        let uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "userProfilePics",
            public_id: newFileName,
            resource_type: "auto",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
      });
    };

    const uploadedImage: any = await streamUpload(req);
    console.log({ uploadedImage });

    const updatedProfilePic = await User.findByIdAndUpdate(
      req.userId,
      {
        profileImg: uploadedImage.secure_url,
      },
      { new: true }
    );
    if (updatedProfilePic) {
      res.send({ profileImg: updatedProfilePic.profileImg, success: true });
    } else {
      res.send({ error: "Error updating Profile pic" });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: "File upload failed" });
  }
};

export { uploadCoverPic, uploadProfilePic };
