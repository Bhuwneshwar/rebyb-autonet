import { ObjectId } from "mongoose";
import User, { IUser } from "../models/UsersSchema";

const identification = async (identifyId: string, rootUser: IUser) => {
  try {
    if (!identifyId) return { error: "Invalid IdentifyId" };
    if (identifyId == "") return { error: "Invalid IdentifyId" };

    const contactRegex = /([5-9]{1}[0-9]{9})$/;
    const idRegex = /^[0-9a-fA-F]{24}$/;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const referRegex = /^[a-zA-Z0-9]{1,50}$/;

    let doc: IUser | null;

    if (contactRegex.test(identifyId)) {
      const regexTrimmedContact = identifyId.match(contactRegex);
      if (regexTrimmedContact) {
        doc = await User.findOne({
          contact: regexTrimmedContact[0],
          userType: "permanent",
        });
        return {
          doc,
          type: "contact",
          contact: regexTrimmedContact[0],
          sameAccount: rootUser.contact === +regexTrimmedContact[0],
        };
      } else {
        return { error: "Invalid Contact" };
      }
    } else if (emailRegex.test(identifyId)) {
      doc = await User.findOne({
        email: identifyId,
        userType: "permanent",
      });
      return {
        doc,
        type: "email",
        email: identifyId,
        sameAccount: rootUser.email === identifyId,
      };
    } else if (idRegex.test(identifyId)) {
      const id: any = identifyId;

      doc = await User.findById(identifyId);
      return {
        doc,
        type: "id",
        id: identifyId,
        sameAccount: rootUser._id === id,
      };
    } else if (referRegex.test(identifyId)) {
      doc = await User.findOne({
        referCode: identifyId,
        userType: "permanent",
      });
      return {
        doc,
        type: "referCode",
        referCode: identifyId,
        sameAccount: rootUser.referCode === identifyId,
      };
    } else {
      return { error: "Invalid IdentifyId" };
    }
  } catch (e) {
    console.log("Identification error:", e);
    // Propagate the error for centralized error handling
    return { error: "Invalid IdentifyId" };
  }
};

export default identification;
