const userModel = require("../model/userModel");

const allReadyRegisterd = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    next()
  } catch (error) {
    console.log(error);
  }
};

module.exports = allReadyRegisterd;
