import nodemailer from "nodemailer";
import userVerification from "./template/sendCodeTemplate";
import { IUser } from "../@types/userInterfaces";

const sendCodeVerification = async function (receiver: IUser) {
  try {
    const email = process.env.EMAIL;
    const password = process.env.EMAIL_PASSWORD;
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    const mailOptions = {
      from: {
        name: "PayGo",
        address: email,
      },
      to: [receiver.email],
      subject: "Login Verification (PayGo)",
      text: "",
      html: userVerification(receiver),
    };

    // @ts-expect-error
    const info = await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email", error);
  }
};

export default sendCodeVerification;
