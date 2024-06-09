const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "SS BBQ",
    link: "https://mailgen.js/",
    logo: "http://localhost:3000/img/logo.png",
  },
});

const sendOTPEmail = async (email, otp) => {
  // const email = "nitishvit2003@gmail.com";
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const userName = email.split("@")[0];

  var emailContent = {
    body: {
      name: userName,
      intro: `
        <div style="text-align: center;">
          <h1 style="font-size: 24px; font-weight: bold; color: #ff6600;">SS BBQ</h1>
          <p>Dear ${userName},</p>
          <p>We are thrilled to have you as part of our SS BBQ family!</p>
          <p>For your security, we have generated a One-Time Password (OTP) just for you.</p>
          <p>Your OTP is <strong>${otp}</strong>. It is valid for the next 1 minute.</p>
        </div>`,
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  // Generate an HTML email with the provided contents
  const emailBody = mailGenerator.generate(emailContent);

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code from SS BBQ",
    html: emailBody,
  };

  try {
    await transporter.sendMail(message);
    console.log("OTP email sent");
  } catch (error) {
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { sendOTPEmail };
