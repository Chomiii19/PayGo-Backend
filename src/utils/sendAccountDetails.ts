import nodemailer from "nodemailer";
import userCredentialTemplate from "./template/userCredentialTemplate";

const sendAccountDetails = async function (
  accountNumber: string,
  receiverPassword: string,
  receiverEmail: string
) {
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
      to: [receiverEmail],
      subject: "Account Credentials (PayGo)",
      text: "",
      html: userCredentialTemplate(accountNumber, receiverPassword),
    };

    // @ts-expect-error
    const info = await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email", error);
  }
};

export default sendAccountDetails;
