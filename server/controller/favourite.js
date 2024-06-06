const favouriteModel = require("../model/favourite");

const addAndRemoveFav = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const existingUserFav = await favouriteModel
      .findOne({ userId })
      .populate("products");

    if (existingUserFav) {
      const productIndex = existingUserFav.products.findIndex(
        (data) => data._id.toString() === productId.toString()
      );

      if (productIndex !== -1) {
        existingUserFav.products.splice(productIndex, 1);
        await existingUserFav.save();
        return res.status(200).json({
          message: "Product removed from favorites",
          favProduct: existingUserFav.products,
        });
      } else {
        existingUserFav.products.push(productId);
        await existingUserFav.save();
        return res.status(200).json({
          message: "Product added to favorites",
        });
      }
    } else {
      const newUserFav = new favouriteModel({
        userId,
        products: [productId],
      });
      await newUserFav.save();
      return res.status(201).json({
        message: "Product added to favorites",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getFav = async (req, res) => {
  const userId = req.user._id;
  try {
    const favProduct = await favouriteModel
      .findOne({ userId })
      .populate("products");
    return res
      .status(200)
      .json({ message: "Products resived", favProduct: favProduct.products });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

const favColour = async (req, res) => {
  const userId = req.user._id;
  try {
    const favProduct = await favouriteModel.findOne({ userId });
    return res
      .status(200)
      .json({ message: "Products resived", favProduct: favProduct.products });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

module.exports = { addAndRemoveFav, getFav, favColour };
