const jwt = require("jsonwebtoken");

const accessTokens = (res, existingUserId, existingUserRole) => {
  try {
    const accessTokens = jwt.sign(
      { _id: existingUserId, role: existingUserRole },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("jwtaccess", accessTokens, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 10000,
    });
  } catch (error) {
    console.log(error);
  }
};

const refreshTokens = (req, existingUserId, existingUserRole) => {
  try {
    const refreshTokens = jwt.sign(
      { _id: existingUserId, role: existingUserRole },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    req.session.refreshToken = refreshTokens;
  } catch (error) {
    console.log(error);
  }
};

const uiTokens = (res, existingUserId, existingUserRole) => {
  try {
    const accessTokens = jwt.sign(
      { _id: existingUserId, role: existingUserRole },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("uiToken", accessTokens, {
      sameSite: "Strict",
      maxAge: 60 * 60 * 10000,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { accessTokens, refreshTokens, uiTokens };
