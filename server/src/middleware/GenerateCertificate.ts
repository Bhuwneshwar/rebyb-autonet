//const QRCode = require("qrcode");
//const PDFDocument = require("pdfkit");
//const blobStream = require("blob-stream");
// const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
// const QRCode = require("qrcode");
// const fs = require("fs");

//const fs = require("fs");
import { Request, Response } from "express";

const generateCertificate = async (req: Request, res: Response) => {
  // //const express = require('express');
  // //const app = express();
  // const pdf = require("html-pdf");
  // //const QRCode = require('qrcode');
  // //const fs = require('fs');
  // const html = `
  //   <!DOCTYPE html>
  //   <html>
  //     <head>
  //       <meta charset="UTF-8">
  //       <title>My PDF</title>
  //     </head>
  //     <body>
  //       <h1>Hello, World!</h1>
  //       <img id="qr-code" src="">
  //     </body>
  //   </html>
  // `;
  // const options = { format: "Letter" };
  // pdf.create(html, options).toBuffer((err, buffer) => {
  //   if (err) {
  //     console.error(err);
  //     res.status(500).send("Error generating PDF");
  //   } else {
  //     QRCode.toDataURL("https://example.com", (err, url) => {
  //       if (err) {
  //         console.error(err);
  //         res.status(500).send("Error generating QR code");
  //       } else {
  //         const qrCodeImg = `<img src="${url}">`;
  //         const htmlWithQrCode = html.replace(
  //           '<img id="qr-code" src="">',
  //           qrCodeImg
  //         );
  //         pdf
  //           .create(htmlWithQrCode, options)
  //           .toFile("my-pdf.pdf", (err, res) => {
  //             if (err) {
  //               console.error(err);
  //               res.status(500).send("Error generating PDF");
  //             } else {
  //               fs.readFile("my-pdf.pdf", (err, data) => {
  //                 if (err) {
  //                   console.error(err);
  //                   res.status(500).send("Error downloading PDF");
  //                 } else {
  //                   res.setHeader("Content-Type", "application/pdf");
  //                   res.setHeader(
  //                     "Content-Disposition",
  //                     "attachment; filename=my-pdf.pdf"
  //                   );
  //                   res.send(data);
  //                 }
  //               });
  //             }
  //           });
  //       }
  //     });
  //   }
  // });
  // /*
  // async function generatePDF(name) {
  //   // Create a new PDF document
  //   const pdfDoc = await PDFDocument.create();
  //   // Set the font for the document
  //   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  //   // Add a new page to the document
  //   const page = pdfDoc.addPage();
  //   // Draw the name on the page
  //   page.drawText(`Hello, ${name}!`, {
  //     x: 50,
  //     y: page.getSize().height - 50,
  //     size: 50,
  //     font,
  //     color: rgb(0, 0.53, 0.71),
  //   });
  //   // Generate a QR code for the name
  //   const qrCode = await QRCode.toDataURL(name);
  //   // Embed the QR code image in the document
  //   const imageBytes = await fetch(qrCode).then((res) => res.arrayBuffer());
  //   const image = await pdfDoc.embedPng(imageBytes);
  //   const imageSize = image.scale(0.5);
  //   // Draw the QR code on the page
  //   page.drawImage(image, {
  //     x: 50,
  //     y: page.getSize().height - 200,
  //     width: imageSize.width,
  //     height: imageSize.height,
  //   });
  //   // Save the PDF to a buffer
  //   const pdfBytes = await pdfDoc.save();
  //   // Return the PDF buffer
  //   return pdfBytes;
  // }
  // const { name } = req.params;
  // const pdfBytes = await generatePDF(name);
  // res.setHeader("Content-Type", "application/pdf");
  // res.setHeader("Content-Disposition", `attachment; filename="${name}.pdf"`);
  // res.send(pdfBytes);
  // console.log(pdfBytes);
  //  // create a new PDF document
  // const doc = new PDFDocument();
  // const stream = doc.pipe(blobStream());
  // // add content to the PDF document
  // doc.text("Hello, World!");
  // // finalize the PDF and get a blob URL
  // stream.on("finish", () => {
  //   const url = stream.toBlobURL("application/pdf");
  //   console.log(url);
  //   res.redirect(url);
  // });
  // // end the PDF document
  // doc.end();
  // return console.log(parameters);
  // let { _id, name, email, contact, age, gender } = parameters;
  // //let objData = {id:_id,name,email, contact,age,gender};
  // //let jsonData = JSON.stringify(objData);
  // const generateQRCode = async (id) => {
  //   try {
  //     const qrCode = await QRCode.toDataURL(
  //       "https://rebybfund5.com/?user=" + id
  //     );
  //     return qrCode;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const generateCertificatePDF = async (name, id) => {
  //   try {
  //     const pdfDoc = new PDFDocument();
  //     const qrCode = await generateQRCode(id);
  //     // Add the name to the PDF
  //     pdfDoc.text(`Certificate of Completion for ${name}`, {
  //       align: "center",
  //       underline: true,
  //       fontSize: 18,
  //     });
  //     // Add the QR code to the PDF
  //     pdfDoc.image(qrCode, {
  //       fit: [150, 150],
  //       align: "center",
  //     });
  //     // Save the PDF to a file
  //     pdfDoc.pipe(fs.createWriteStream(`${name}.pdf`));
  //     pdfDoc.end();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // generateCertificatePDF(name, _id);
  // */
};
export default generateCertificate;
