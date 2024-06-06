const otpGenerator = require("otp-generator");
const userModel = require("../model/userModel");

const generateOTP = async (req, res) => {
  const { email } = req.body;
  console.log(req.session.otpLimit);
  try {
    const existingEmail = await userModel.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (req.session.otpLimit >= 5 && req.session.otpLimit) {
      if (req.session.otpLimitTime < Date.now()) {
        req.session.otpLimit = 0;
      }

      return res
        .status(400)
        .json({ message: "otp limit reached , try after some times" });
    } else {
      const generatedOTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      req.session.otpLimit = (req.session.otpLimit || 0) + 1;
      req.session.OTP = generatedOTP;
      req.session.OTPExpiresAt = Date.now() + 60000; // 1 minute
      req.session.otpLimitTime = Date.now() + 1800000; // 30 minutes

      console.log(generatedOTP);
      return res.status(201).json({ code: generatedOTP });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { generateOTP };
