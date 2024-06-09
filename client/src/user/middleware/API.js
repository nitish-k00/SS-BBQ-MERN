import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8000";

const profileInfo = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/profileInfo`);
    return data.userData;
  } catch (error) {
    return;
  }
};

const editProfile = async (updatedData) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/auth/editProfile`,
      updatedData
    );
    toast.success(data?.message);
    return data.userData;
  } catch (error) {
    console.log(error, "ss");
  }
};

const logout = async () => {
  try {
    await axios.post(`${BASE_URL}/auth/logout`);
  } catch (error) {
    return;
  }
};

const getProduct = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/auth/allProduct");
    return data.product;
  } catch (error) {
    return error.response?.data?.message;
  }
};

const singleProduct = async (id) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/auth/singleProduct/${id}`
    );
    return data.product;
  } catch (error) {
    return error.response?.data?.message;
  }
};

const getCategory = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/auth/allCategory");
    return data.categories;
  } catch (error) {
    return error.response?.data?.message;
  }
};

const relatedProducted = async (name) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/auth/cateProduct/${name}`
    );
    return data.CategoryProduct;
  } catch (error) {}
};

const specialProduct = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/auth/specialProduct"
    );
    return data.product;
  } catch (error) {
    return [];
  }
};

const addToCart = async (productId) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/addtocart`, {
      productId,
    });
    toast.success(data?.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

const getCart = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/auth/carts");
    console.log(data.cartProduct);
    return data.cartProduct;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getCartcheack = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/auth/cartcheack");
    return data.cartProduct;
  } catch (error) {
    return [];
  }
};

const updateQuantatiy = async (productId, quantity) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/auth/updateQuantatiy`, {
      productId,
      quantity,
    });
    toast.success(data?.message);
    return data.cart;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

const removeFromCart = async (productId) => {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/auth/removeFromCart/${productId}`
    );
    toast.success(data?.message);
    return data.cart;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

const getFav = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/auth/fav");
    return data.favProduct;
  } catch (error) {
    return [];
  }
};

const addAndRemoveFav = async (productId) => {
  try {
    const { data } = await axios.post(
      `http://localhost:8000/auth/addAndRemoveFav/${productId}`
    );
    toast.success(data?.message);
    console.log(data);
    return data.favProduct;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
};

const getFavColours = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/auth/favColour");
    return data.favProduct;
  } catch (error) {
    return [];
  }
};

const getAdressMapApi = async (lat, lng) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/auth/maps-addres-api?lat=${lat}&lon=${lng}`
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export {
  profileInfo,
  logout,
  editProfile,
  getProduct,
  getCategory,
  singleProduct,
  relatedProducted,
  specialProduct,
  addToCart,
  getCart,
  getCartcheack,
  updateQuantatiy,
  removeFromCart,
  getFav,
  addAndRemoveFav,
  getFavColours,
  getAdressMapApi,
};
