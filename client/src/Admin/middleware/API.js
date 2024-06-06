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
