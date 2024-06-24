import React, { useEffect, useState } from "react";
import {
  ProductNameQuantity,
  allTodayOrders,
  ordersTodayData,
} from "../middleware/API";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import islogin from "../../user/middleware/isLogin";
import { profileInfo } from "../../user/middleware/API";
import { modifyUserInfo } from "../../redux/slices/userInfo";
import axios from "axios";
import OrderTable from "../middleware/OrderTable";
import { Typography } from "@mui/material";
import ProductChart from "../middleware/ProductChart";
import "../../index.css";

function ADashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersDATA, setOrdersDATA] = useState({});
  const [product, setProduct] = useState([]);
  const [productFilter, setProductFilter] = useState([]);

  // State variables for animated values
  const [animatedTotalOrders, setAnimatedTotalOrders] = useState(0);
  const [animatedTotalAmount, setAnimatedTotalAmount] = useState(0);
  const [animatedCreated, setAnimatedCreated] = useState(0);
  const [animatedConfirmed, setAnimatedConfirmed] = useState(0);
  const [animatedPrepared, setAnimatedPrepared] = useState(0);
  const [animatedPicked, setAnimatedPicked] = useState(0);
  const [animatedDelivered, setAnimatedDelivered] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedJWT = islogin();
        if (decodedJWT !== null) {
          const userData = await profileInfo();
          dispatch(
            modifyUserInfo({
              name: userData.name,
              email: userData.email,
              address: userData.address,
              phoneNo: userData.phoneNo,
              avator: userData.avator,
              role: decodedJWT.role,
              login: !!decodedJWT,
            })
          );
          try {
            await axios.post("http://localhost:8000/auth/removeUiToken");
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    fetchOrders();
    fetchOrdersTodayData();
    fetchProductNameQuantity();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await allTodayOrders();
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrdersTodayData = async () => {
    try {
      const response = await ordersTodayData();
      setOrdersDATA(response.orders);
      // Trigger animation when data updates
      animateValues(response.orders);
    } catch (error) {
      console.error("Error fetching orders data:", error);
    }
  };

  const fetchProductNameQuantity = async () => {
    try {
      const response = await ProductNameQuantity();
      const sortedProducts = response.sort((a, b) => a.quantity - b.quantity);
      setProduct(sortedProducts);
      setProductFilter(sortedProducts);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  function handleEdit(id) {
    navigate(`/singleOrder/${id}`, { state: { page: "/" } });
  }

  function handleDelete(id) {
    console.log("Delete:", id);
    // Add your delete logic here
  }

  const onChangeProductFilter = (value) => {
    const filteredData = product.filter((data) =>
      data.name.toLowerCase().includes(value.toLowerCase())
    );
    setProductFilter(filteredData);
  };

  // Function to animate values
  const animateValues = (data) => {
    // Animate total orders
    animateValue(animatedTotalOrders, setAnimatedTotalOrders, data.totalOrders);

    // Animate total amount
    animateValue(animatedTotalAmount, setAnimatedTotalAmount, data.totalAmount);

    // Animate other statuses if available
    if (data.OrderStatus) {
      animateValue(
        animatedCreated,
        setAnimatedCreated,
        data.OrderStatus.created
      );
      animateValue(
        animatedConfirmed,
        setAnimatedConfirmed,
        data.OrderStatus.confirmed
      );
      animateValue(
        animatedPrepared,
        setAnimatedPrepared,
        data.OrderStatus.prepared
      );
      animateValue(animatedPicked, setAnimatedPicked, data.OrderStatus.picked);
      animateValue(
        animatedDelivered,
        setAnimatedDelivered,
        data.OrderStatus.delivered
      );
    }
  };

  // Function to animate a single value incrementally
  const animateValue = (start, setter, end) => {
    const increment = Math.ceil(end / 100); // Divide end value to get incremental step
    let current = start;
    const interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(interval);
      }
      setter(current);
    }, 10); // Adjust the interval speed as needed
  };

  return (
    <div className="container">
      <ProductChart />
      <Typography variant="h4" gutterBottom className="mt-4">
        Today's Order Table
      </Typography>

      <div className="row">
        <div className="col-12 col-md-5 mb-5">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by product name"
            onChange={(e) => onChangeProductFilter(e.target.value)}
          />
          <div
            className="product-list-container"
            style={{ height: "50vh", overflowY: "auto" }}
          >
            {productFilter.map((data) => (
              <div className="product-box bg-light p-2 mb-2" key={data.name}>
                <p className="mb-1">{data.name}</p>
                <p className="mb-0 bold h2">{data.quantity}</p>
              </div>
            ))}
            {productFilter.length === 0 && (
              <p className="text-muted">No products found</p>
            )}
          </div>
        </div>

        <div className="col-12 col-md-7 d-flex flex-wrap justify-content-evenly">
          <div className="custom-today-data total">
            <p className="font-size">{animatedTotalOrders}</p>
            <p>TOTAL ORDER</p>
          </div>
          <div className="custom-today-data total">
            <p className="font-size">{animatedTotalAmount}</p>
            <p>TOTAL AMOUNT</p>
          </div>
          <div className="custom-today-data created">
            <p className="font-size">{animatedCreated}</p>
            <p>CREATED</p>
          </div>
          <div className="custom-today-data confirmed">
            <p className="font-size">{animatedConfirmed}</p>
            <p>CONFIRMED</p>
          </div>
          <div className="custom-today-data prepared">
            <p className="font-size">{animatedPrepared}</p>
            <p>PREPARED</p>
          </div>
          <div className="custom-today-data picked">
            <p className="font-size">{animatedPicked}</p>
            <p>PICKED</p>
          </div>
          <div className="custom-today-data delivered">
            <p className="font-size">{animatedDelivered}</p>
            <p>DELIVERED</p>
          </div>
        </div>
      </div>

      <OrderTable
        orders={orders}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default ADashboard;
