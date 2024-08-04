import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function SendMail(
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<boolean> {
  try {
    console.log(text);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rebybfund5@gmail.com",
        pass: process.env.GPASS,
      },
    });

    const mailOptions: MailOptions = {
      from: "rebybfund5@gmail.com",
      to,
      subject,
      text: "Sorry for intract you! this is test mail!",
      html: `<div><h3>ONE TIME PASSWORD</h3><br/><h2>${html}</h2></div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default SendMail;
