import axios from "axios";
import { toast } from "react-toastify";

export const getCategory = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/auth/allCategory");
    return data.categories;
  } catch (error) {
    return error.response?.data?.message;
  }
};

export const createCategory = async (newCategories) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8000/auth/createCategory",
      {
        name: newCategories,
      }
    );
    toast.success(data?.message);
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

export const editCategorys = async (updateCategories) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8000/auth/updateCategory/${updateCategories._id}`,
      {
        name: updateCategories.name,
      }
    );
    return toast.success(data?.message);
  } catch (error) {
    return toast.error(error.response?.data?.message);
  }
};

export const deleteCategory = async (Categories) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8000/auth/deleteCategory/${Categories._id}`
    );
    return toast.success(data?.message);
  } catch (error) {
    return toast.error(error.response?.data?.message);
  }
};

///

export const createProduct = async (newProduct) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8000/auth/createProduct",
      newProduct
    );
    toast.success(data?.message);
    console.log(data.product, "create");
    return data.product;
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error);
  }
};

export const getProduct = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/auth/allProduct");
    return data.product;
  } catch (error) {
    return error.response?.data?.message;
  }
};

export const editProduct = async (updateProduct) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8000/auth/updateProduct/${updateProduct._id}`,
      updateProduct
    );

    toast.success(data?.message);
    return data.product;
  } catch (error) {
    console.log(error);
    return toast.error(error.response?.data?.message);
  }
};

export const deleteProduct = async (Product) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8000/auth/deleteProduct/${Product}`
    );
    toast.success(data?.message);
    console.log(data.product, "delete");
    return data.product;
  } catch (error) {
    return toast.error(error.response?.data?.message);
  }
};

export const createCoupon = async (newCoupon) => {
  try {
    const { data } = await axios.post(
      " http://localhost:8000/auth/createCoupons",
      { newCoupon }
    );
    toast.success(data?.message);
    return data.Coupons;
  } catch (error) {
    console.log(error.response?.data);
    return toast.error(error.response?.data?.message);
  }
};

export const editCoupon = async (editCoupon) => {
  try {
    const { data } = await axios.put(" http://localhost:8000/auth/editCoupon", {
      editCoupon,
    });
    toast.success(data?.message);
    return data.Coupons;
  } catch (error) {
    console.log(error.response?.data);
    return toast.error(error.response?.data?.message);
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    const { data } = await axios.delete(
      " http://localhost:8000/auth/deleteCoupons",
      { data: { couponId } }
    );
    toast.success(data?.message);
    return data.Coupons;
  } catch (error) {
    console.log(error.response?.data);
    return toast.error(error.response?.data?.message);
  }
};

export const allCoupon = async () => {
  try {
    const { data } = await axios.get(" http://localhost:8000/auth/allCoupans");
    return data.coupons;
  } catch (error) {
    console.log(error.response?.data);
  }
};

export const allOrders = async (currentPage) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/auth/allOrders?page=${currentPage}`
    );
    return data;
  } catch (error) {
    console.log(error.response?.data);
  }
};

export const allTodayOrders = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/auth/todayOrders");
    return data.orders;
  } catch (error) {
    console.log(error.response?.data);
  }
};

export const singleOrders = async (orderId) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/auth/singleOrder/${orderId}`
    );
    return data;
  } catch (error) {
    console.log(error.response?.data);
  }
};

export const deliveryStatusChange = async (orderId, status, productId) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8000/auth/deliveryStatusChange/${orderId}`,
      { status, productId }
    );
    return data;
  } catch (error) {
    console.log(error.response?.data);
  }
};

export const GetAllUsers = async () => {
  try {
    const { data } = await axios.get(" http://localhost:8000/auth/GetAllUsers");
    return data.users;
  } catch (error) {
    console.log(error.response?.data);
  }
};

export const GetSingleUsers = async (userId) => {
  try {
    const { data } = await axios.get(
      ` http://localhost:8000/auth/GetSingleUsers/${userId}`
    );
    return data.users;
  } catch (error) {
    console.log(error.response?.data);
  }
};

export const userOrders = async (userId) => {
  try {
    const { data } = await axios.get(
      ` http://localhost:8000/auth/GetSingleUsersOrders/${userId}`
    );
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return [];
  }
};

export const CouponCartcheck = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000//auth/cartCouponCheack"
    );
    toast.success(data?.message);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const allOrdersDate = async (currentDate) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/auth/allOrdersDate?date=${currentDate}`
    );
    return data;
  } catch (error) {
    console.log(error.response?.data);
  }
};

export const ordersTodayData = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/auth/ordersTodayData"
    );
    return data;
  } catch (error) {
    console.log(error.response?.data);
  }
};

export const ProductNameQuantity = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/auth/ProductNameQuantity"
    );
    return data.product;
  } catch (error) {
    console.log(error.response?.data);
  }
};
