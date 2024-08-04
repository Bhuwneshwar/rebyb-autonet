import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import axios from "axios";
import identificationService from "./identifyId";
import { port } from "..";

const generateIdCard = async (req: Request, res: Response) => {
  const { identifyId } = req.params;
  console.log({ identifyId });

  if (typeof identifyId !== "string")
    return res.send({ error: "IdentifyId should be string" });
  if (identifyId === "") return res.send({ error: "identifyId is required" });

  const identified = await identificationService(identifyId);

  if (identified.error) {
    return res.status(400).json(identified);
  }

  if (!identified.doc) {
    return res.status(400).json({ error: "invalid identifyId" });
  }

  //generate past date from age
  const age = identified.doc.age;

  // Create the PDF document with custom dimensions similar to an ATM card
  const doc = new PDFDocument({
    size: [300, 450], // Custom size to match the card dimensions
    margins: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

  // Set the absolute path to the 'certificates' directory within the 'server' directory
  const certificatesDir = path.resolve(__dirname, "../..", "certificates");
  console.log({ certificatesDir });

  // Ensure the certificates directory exists
  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir);
  }

  const filePath = path.join(
    certificatesDir,
    `${identified.doc.referCode} [Auto-Net Card].pdf`
  );
  console.log({ filePath });

  // Create a writable stream to save the PDF file
  const writeStream = fs.createWriteStream(filePath);

  // Add logging for stream events
  writeStream.on("finish", () => {
    console.log("PDF file has been written successfully.");
    res.send({
      success: true,
      url: `http://localhost:${port}/certificates/${identified.doc?.referCode} [Auto-Net Card].pdf`,
      path: `/certificates/${identified.doc?.referCode} [Auto-Net Card].pdf`,
      //comment out this
      port: port,
    });

    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting certificate file:", err);
        } else {
          console.log("Certificate file deleted successfully. => " + filePath);
        }
      });
    }, 1000 * 60);
  });

  writeStream.on("error", (err) => {
    console.error("Error writing PDF file:", err);
    res.status(500).json({ error: "Error generating PDF" });
  });

  // Pipe the PDF document to the write stream
  doc.pipe(writeStream);

  try {
    console.log(identified.doc.referCode);

    const qrCodeDataUrl = await QRCode.toDataURL(
      identified.doc._id.toString() || "code"
    );

    // Download the profile picture
    let profileImg;
    if (identified.doc?.profileImg) {
      profileImg = identified.doc.profileImg;
    } else {
      if (identified.doc?.gender === "male") {
        profileImg =
          "https://th.bing.com/th/id/OIP.MYwdjrgFU0JwL6ahVIdgZwHaH_?rs=1&pid=ImgDetMain"; //male
      } else if (identified.doc?.gender === "female") {
        profileImg = "https://cdn-icons-png.flaticon.com/512/65/65581.png"; //female
      } else {
        profileImg =
          "https://media.istockphoto.com/id/1305034196/vector/transgender-avatar-in-red-sweatshirt.jpg?s=612x612&w=is&k=20&c=K7kim26X_ZysaKGFT7h0tGA67VBYiPJuyN3kL7D2l1g="; //other
      }
    }

    const profilePicUrl = profileImg;
    const profilePicPath = path.join(certificatesDir, "profile-pic.jpg");

    const response = await axios({
      url: profilePicUrl,
      responseType: "stream",
    });

    // Save the profile picture to the local file system
    const writer = fs.createWriteStream(profilePicPath);
    response.data.pipe(writer);

    // // Download the logo image
    // const logoUrl = "https://example.com/logo.png"; // Replace with your actual logo URL
    // const logoPath = path.join(certificatesDir, "logo.png");

    // const logoResponse = await axios({
    //   url: logoUrl,
    //   responseType: "stream",
    // });

    // const logoWriter = fs.createWriteStream(logoPath);
    // logoResponse.data.pipe(logoWriter);

    writer.on("finish", () => {
      // Set background color for ID card
      doc.rect(0, 0, 300, 450).fill("#e6ebf5");

      // Header section (QR code and profile picture)
      doc
        .save()
        .image(qrCodeDataUrl, 20, 20, { width: 100, height: 100 })
        .restore();

      doc
        .save()
        .image(profilePicPath, 180, 20, {
          width: 90,
          height: 90,
        })
        .restore();

      // Info section background
      doc.rect(0, 140, 300, 270).fill("#b7c8f1");

      // Add text
      doc
        .fontSize(20)
        .fillColor("#333")
        .text(identified.doc?.name || "", 20, 150, { align: "left" });

      doc
        .fontSize(10)
        .fillColor("#555")
        .text("Permanent ID:", 20, 200)
        .text(identified.doc?._id.toString() || "", 120, 200)
        .moveDown(0.5)
        .text("Username:", 20, 220)
        .text(identified.doc?.referCode || "", 120, 220)
        .moveDown(0.5)
        .text("Age:", 20, 240)
        .text(`${age} years old`, 120, 240)
        .moveDown(0.5)
        .text("Email:", 20, 260)
        .text(identified.doc?.email || "", 120, 260)
        .moveDown(0.5)
        .text("Contact:", 20, 280)
        .text(String(identified.doc?.contact) || "", 120, 280);

      // doc.text(
      //   "This Auto-Net Card Use case: Scan QR Code for send Money or Withdraw Amount."
      // );

      // Footer
      doc.rect(0, 410, 300, 40).fill("#6b8adf");

      // Add the logo to the footer
      const logoPath = path.resolve(__dirname, "../images/logo.png");
      console.log({ logoPath });

      doc.save().image(logoPath, 5, 410, { width: 50, height: 40 }).restore();

      doc
        .fontSize(10)
        .fillColor("#0beb38")
        .text("www.rebyb-auto-net.com", 0, 420, { align: "center" });

      doc
        .fontSize(10)
        .fillColor("#0beb38")
        .text("Powered by RebyB Auto-Net", 0, 435, { align: "center" });

      // Finalize the PDF and end the stream
      doc.end();

      console.log("PDF generation complete.");
    });

    writer.on("error", (err) => {
      console.error("Error downloading profile picture:", err);
      res.status(500).json({ error: "Error downloading profile picture" });
    });

    // logoWriter.on("error", (err) => {
    //   console.error("Error downloading logo:", err);
    //   res.status(500).json({ error: "Error downloading logo" });
    // });
  } catch (error) {
    console.error("Error generating QR code or creating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
};

export default generateIdCard;

// import { Request, Response } from "express";
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import QRCode from "qrcode";
// import axios from "axios";
// import identificationService from "./identifyId";
// import { port } from "..";

// const generateIdCard = async (req: Request, res: Response) => {
//   const { identifyId } = req.params;
//   console.log("generateIdCard");

//   if (!identifyId) {
//     return res.status(400).json({ error: "identifyId is required" });
//   }

//   const identified = await identificationService(identifyId);

//   if (identified.error) {
//     return res.status(400).json(identified);
//   }

//   if (!identified.doc) {
//     return res.status(400).json({ error: "invalid identifyId" });
//   }

//   //generate past date from age
//   const age = identified.doc.age;
//   const pastDate = new Date(new Date().getFullYear() - age, 0, 1);

//   // Create the PDF document with custom dimensions similar to an ATM card
//   const doc = new PDFDocument({
//     size: [300, 450], // Custom size to match the card dimensions
//     margins: {
//       top: 0,
//       bottom: 0,
//       left: 0,
//       right: 0,
//     },
//   });

//   // Set the absolute path to the 'certificates' directory within the 'server' directory
//   const certificatesDir = path.resolve(__dirname, "../..", "certificates");
//   console.log({ certificatesDir });

//   // Ensure the certificates directory exists
//   if (!fs.existsSync(certificatesDir)) {
//     fs.mkdirSync(certificatesDir);
//   }

//   const filePath = path.join(
//     certificatesDir,
//     `${identified.doc.referCode}.pdf`
//   );
//   console.log({ filePath });

//   // Create a writable stream to save the PDF file
//   const writeStream = fs.createWriteStream(filePath);

//   // Add logging for stream events
//   writeStream.on("finish", () => {
//     console.log("PDF file has been written successfully.");
//     res.send({
//       success: true,
//       url: `http://localhost:${port}/certificates/${identified.doc?.referCode}.pdf`,
//     });

//     setTimeout(() => {
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error("Error deleting certificate file:", err);
//         } else {
//           console.log("Certificate file deleted successfully. => " + filePath);
//         }
//       });
//     }, 1000 * 60);
//   });

//   writeStream.on("error", (err) => {
//     console.error("Error writing PDF file:", err);
//     res.status(500).json({ error: "Error generating PDF" });
//   });

//   // Pipe the PDF document to the write stream
//   doc.pipe(writeStream);

//   try {
//     console.log(identified.doc.referCode);

//     const qrCodeDataUrl = await QRCode.toDataURL(
//       identified.doc.referCode || "code"
//     );

//     // Download the profile picture

//     let profileImg;
//     if (identified.doc?.profileImg) {
//       profileImg = identified.doc.profileImg;
//     } else {
//       if (identified.doc?.gender === "male") {
//         profileImg =
//           "https://th.bing.com/th/id/OIP.MYwdjrgFU0JwL6ahVIdgZwHaH_?rs=1&pid=ImgDetMain"; //male
//       } else if (identified.doc?.gender === "female") {
//         profileImg = "https://cdn-icons-png.flaticon.com/512/65/65581.png"; //female
//       } else {
//         profileImg =
//           "https://media.istockphoto.com/id/1305034196/vector/transgender-avatar-in-red-sweatshirt.jpg?s=612x612&w=is&k=20&c=K7kim26X_ZysaKGFT7h0tGA67VBYiPJuyN3kL7D2l1g="; //other
//       }
//     }

//     const profilePicUrl = profileImg;
//     const profilePicPath = path.join(certificatesDir, "profile-pic.jpg");

//     const response = await axios({
//       url: profilePicUrl,
//       responseType: "stream",
//     });

//     // Save the profile picture to the local file system
//     const writer = fs.createWriteStream(profilePicPath);
//     response.data.pipe(writer);

//     writer.on("finish", () => {
//       // Set background color for ID card
//       doc.rect(0, 0, 300, 450).fill("#e6ebf5");

//       // Header section (QR code and profile picture)
//       doc
//         .save()
//         .image(qrCodeDataUrl, 20, 20, { width: 100, height: 100 })
//         .restore();

//       doc
//         .save()
//         .image(profilePicPath, 180, 20, {
//           width: 90,
//           height: 90,
//         })
//         .restore();

//       // Info section background
//       doc.rect(0, 140, 300, 270).fill("#b7c8f1");

//       // Add text
//       doc
//         .fontSize(20)
//         .fillColor("#333")
//         .text(identified.doc?.name || "", 20, 150, { align: "left" });

//       doc
//         .fontSize(12)
//         .fillColor("#555")
//         .text("ReferCode:", 20, 200)
//         .text(identified.doc?.referCode || "", 100, 200)
//         .moveDown(0.5)
//         .text("Birthdate:", 20, 220)
//         .text(pastDate.toDateString(), 100, 220)
//         .moveDown(0.5)
//         .text("Email:", 20, 240)
//         .text(identified.doc?.email || "", 100, 240)
//         .moveDown(0.5)
//         .text("Contact:", 20, 260)
//         .text(String(identified.doc?.contact) || "", 100, 260);

//       // Footer
//       doc.rect(0, 410, 300, 40).fill("#6b8adf");

//       doc
//         .fontSize(10)
//         .fillColor("#fff")
//         .text("www.rebyb-auto-net.com", 20, 420, { align: "center" });

//       // Finalize the PDF and end the stream
//       doc.end();

//       console.log("PDF generation complete.");
//     });

//     writer.on("error", (err) => {
//       console.error("Error downloading profile picture:", err);
//       res.status(500).json({ error: "Error downloading profile picture" });
//     });
//   } catch (error) {
//     console.error("Error generating QR code or creating PDF:", error);
//     res.status(500).json({ error: "Error generating PDF" });
//   }
// };

// export default generateIdCard;
