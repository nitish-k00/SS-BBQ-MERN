const express = require("express");
const {
  register,
  login,
  logout,
  uiToken,
  GetForgotPasswordEmail,
  forgotPasswordOtpCheack,
  NewPaaword,
} = require("../controller/user");
const { tokenCheck } = require("../midlleware/tokenCheack");
const { generateOTP } = require("../midlleware/genateOtp");
const passport = require("passport");
const {
  accessTokens,
  refreshTokens,
  uiTokens,
} = require("../midlleware/setToken");
const allReadyRegisterd = require("../midlleware/allreadyRegistered");
const route = express.Router();

route.post("/register", register);
route.post("/login", login);
route.post("/genrateotp", allReadyRegisterd, generateOTP);
route.post("/logout", tokenCheck, logout);
route.post("/removeUiToken", uiToken);
route.post("/GetForgotPasswordEmail", GetForgotPasswordEmail,generateOTP);
route.post("/forgotPasswordOtpCheack", forgotPasswordOtpCheack);
route.post("/NewPaaword", NewPaaword);
route.post("/genrateotpForgotPassword", generateOTP);

route.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

route.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    const user = req.user;
    accessTokens(res, user._id, user.role);
    refreshTokens(req, user._id, user.role);
    uiTokens(res, user._id, user.role);
    res.redirect("http://localhost:3000/");
  }
);

module.exports = route;
