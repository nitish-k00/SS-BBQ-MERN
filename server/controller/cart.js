const cartModel = require("../model/cart");
const productModel = require("../model/product");
const redisClint = require("../redisClient");

const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const cacheCart = `cart${userId}`;
  try {
    const existingUserCart = await cartModel.findOne({ userId });
    const product = await productModel.findById({ _id: productId });

    if (existingUserCart) {
      const existingProduct = existingUserCart.products.find(
        (data) => data._id.toString() === productId.toString()
      );

      if (existingProduct) {
        if (existingProduct.quantity > product.quantity - 1) {
          return res
            .status(400)
            .json({ message: "Not enough stock available for this product" });
        } else {
          existingProduct.quantity++;
          existingUserCart.total += product.discountPrice;
        }
      } else {
        existingUserCart.products.push({
          _id: productId,
        });
        existingUserCart.total += product.discountPrice;
      }
      await existingUserCart.save();
      await existingUserCart.populate("products._id");
      await redisClint.setEx(cacheCart, 3600, JSON.stringify(existingUserCart));

      return res
        .status(200)
        .json({ message: "Products added to cart", existingUserCart });
    } else {
      const newProduct = { _id: productId };
      const total = product.discountPrice;
      const newUser = new cartModel({ userId, products: [newProduct], total });
      newUser.save();
      await newUser.populate("products._id");
      await redisClint.setEx(cacheCart, 3600, JSON.stringify(newUser));
      return res
        .status(200)
        .json({ message: "Products added to cart", newUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

const getCart = async (req, res) => {
  const userId = req.user._id;
  const cacheCart = `cart${userId}`;
  try {
    const data = await redisClint.get(cacheCart);
    if (data !== null) {
      return res
        .status(200)
        .json({ message: "Products resived", cartProduct: JSON.parse(data) });
    }

    const cartProduct = await cartModel
      .findOne({ userId })
      .populate("products._id");

    await redisClint.setEx(cacheCart, 3600, JSON.stringify(cartProduct));

    return res.status(200).json({ message: "Products resived", cartProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

const Quantity = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const cacheCart = `cart${userId}`;

  try {
    const cart = await cartModel.findOne({ userId }).populate("products._id");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (data) => data._id._id.toString() === productId.toString()
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products[productIndex].quantity = quantity;

    cart.total = cart.products.reduce((total, data) => {
      return total + data._id.discountPrice * data.quantity;
    }, 0);

    await cart.save();
    await redisClint.setEx(cacheCart, 3600, JSON.stringify(cart));
    res.status(200).json({ message: "Quantity updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const cacheCart = `cart${userId}`;

  try {
    const userCart = await cartModel
      .findOne({ userId })
      .populate("products._id");

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = userCart.products.findIndex(
      (data) => data._id._id.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const product = userCart.products[productIndex];
    userCart.total -= product._id.discountPrice * product.quantity;
    userCart.products.splice(productIndex, 1);

    await userCart.save();
    await redisClint.setEx(cacheCart, 3600, JSON.stringify(userCart));
    return res
      .status(200)
      .json({ message: "Product removed from cart", cart: userCart });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

const cartcheack = async (req, res) => {
  const userId = req.user._id;
  try {
    const cartProduct = await cartModel
      .findOne({ userId })
      .populate({ path: "products._id", select: "name" });
    return res
      .status(200)
      .json({ message: "Products resived", cartProduct: cartProduct.products });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

module.exports = { addToCart, getCart, Quantity, removeFromCart, cartcheack };
