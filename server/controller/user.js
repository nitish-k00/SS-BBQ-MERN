const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const {
  accessTokens,
  refreshTokens,
  uiTokens,
} = require("../midlleware/setToken");
dotenv.config();

const register = async (req, res) => {
  const { name, email, reenterpassword, otp } = req.body;
  const storesOtp = req.session.OTP;
  const OTPExpires = req.session.OTPExpiresAt;
  console.log(storesOtp);

  try {
    if (Date.now() > OTPExpires) {
      delete req.session.OTP;
      return res.status(400).json({
        message: "OTP expired or not found. Please generate a new OTP.",
      });
    }
    if (storesOtp !== otp || !storesOtp) {
      return res.status(501).json({ message: "ivalid otp" });
    }
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPass = await bcrypt.hash(reenterpassword, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPass,
    });
    await newUser.save();
    delete req.session.otpLimit;
    delete req.session.OTP;

    const existingUser = await userModel.findOne({ email });
    accessTokens(res, existingUser._id, existingUser.role);
    refreshTokens(req, existingUser._id, existingUser.role);
    uiTokens(res, existingUser._id, existingUser.role);
    return res.status(200).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    if (existingUser.password) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser?.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    accessTokens(res, existingUser._id, existingUser.role);
    refreshTokens(req, existingUser._id, existingUser.role);
    uiTokens(res, existingUser._id, existingUser.role);

    return res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.clearCookie("uiToken");
    res.clearCookie("jwtaccess"); // Clear JWT access token cookie
    res.clearCookie("sid"); // Clear session ID cookie
    res.json({ message: "Logged out successfully" });
  });
};

const uiToken = (req, res) => {
  try {
    res.clearCookie("uiToken");
    res.status(200).json({ message: "uiToken cookie cleared successfully" });
  } catch (error) {
    console.error("Error clearing uiToken cookie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { register, login, logout, uiToken };
