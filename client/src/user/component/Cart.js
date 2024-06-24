import React, { useEffect, useState } from "react";
import {
  getCart,
  updateQuantatiy,
  removeFromCart,
  CouponCartcheck,
} from "../middleware/API";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CouponApply from "../middleware/CouponApply";

function Cart() {
  const [cartValue, setCartValue] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingQuantity, setLoadingQuantity] = useState(false);
  const [isIndex, setIndex] = useState("");
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const navigate = useNavigate();

  console.log(cartValue, "cart");

  const handleQuantityChange = async (id, value) => {
    setLoadingQuantity(true);
    try {
      const cartData = await updateQuantatiy(id, value);
      setCartValue(cartData);
    } catch (error) {
      console.log(error);
    }
    setLoadingQuantity(false);
  };

  const removeCartProduct = async (id) => {
    setLoadingRemove(true);
    try {
      const cartData = await removeFromCart(id);
      setCartValue(cartData);
    } catch (error) {
      console.log(error);
    }
    setLoadingRemove(false);
  };

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        const cartData = await getCart();
        setCartValue(cartData);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchCartData();
  }, []);

  const TotalMRP = () => {
    if (!cartValue || !cartValue.products || cartValue.products.length === 0) {
      return 0;
    }
    return cartValue?.products?.reduce((total, product) => {
      return total + product?._id?.price * product?.quantity;
    }, 0);
  };

  const DiscountonMRP = () => {
    if (!cartValue || !cartValue.products || cartValue.products.length === 0) {
      return 0;
    }
    return cartValue?.products?.reduce((total, product) => {
      return total + product?._id?.discountPrice * product?.quantity;
    }, 0);
  };

  const ShippingFee = () => {
    return 0;
  };

  const placeorderCheack = async () => {
    setLoadingCheck(true);
    try {
      const response = await CouponCartcheck();
      if (response.change) {
        setCartValue(response.userCart);
      } else {
        navigate("/placeorder", { state: { fromCart: true } });
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingCheck(false);
  };

  return (
    <div className=" bg-dark">
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          <CircularProgress style={{ color: "white" }} />
          <p className="ms-2 h2">Loading....</p>
        </div>
      ) : (
        <Container className=" bg-dark">
          {cartValue?.products?.length === 0 ||
          cartValue?.length === 0 ||
          cartValue === null ? (
            <div
              style={{
                height: "95vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    color: "white",
                    marginTop: "200px",
                    fontWeight: "bolder",
                  }}
                >
                  YOUR STOMACH FEELS EMPTY
                </p>
              </div>

              <div>
                <Button onClick={() => navigate("/menu")}>ADD SOME FOOD</Button>
              </div>
            </div>
          ) : (
            <div className="row" style={{ minHeight: "100vh" }}>
              <div className="col-md d-flex flex-column py-4 bg-dark">
                {cartValue?.products?.map((data, index) => (
                  <div className=" my-3 d-flex justify-content-center ">
                    <Card sx={{ display: "flex" }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <CardMedia
                          component="img"
                          className="p-2"
                          sx={{ width: 151, height: "100%", cursor: "pointer" }}
                          image={data?._id?.photo[0]}
                          alt="Live from space album cover"
                          onClick={() => navigate(`/menu/${data?._id._id}`)}
                        />
                      </Box>
                      <CardContent style={{ width: "240px" }}>
                        <div className="d-flex justify-content-between">
                          <Typography component="div" variant="h5">
                            {data?._id?.name}
                          </Typography>

                          {index === isIndex && loadingRemove ? (
                            <Spinner
                              animation="border"
                              role="status"
                              style={{
                                width: "1.5rem",
                                height: "1.5rem",
                                color: "#f78000",
                              }}
                            />
                          ) : (
                            <DeleteIcon
                              style={{ color: "red", cursor: "pointer" }}
                              onClick={() => (
                                removeCartProduct(data?._id?._id),
                                setIndex(index)
                              )}
                            />
                          )}
                        </div>

                        <div style={{ display: "flex" }} className="mt-2">
                          <div style={{ position: "relative" }}>
                            {data?._id?.discount !== 0 && (
                              <div className="crossCart"></div>
                            )}
                            <p
                              className={`card-text${
                                data?._id?.discount ? "price" : "h6 bold"
                              }`}
                            >
                              Rs.{data?._id?.price * data?.quantity}
                            </p>
                          </div>
                          {data?._id?.discount !== 0 && (
                            <>
                              <p className="card-text ms-2 bold">
                                Rs.{data?._id?.discountPrice * data?.quantity}
                              </p>
                              <p
                                className="card-text ms-2 bold"
                                style={{ color: "green", fontSize: "10px" }}
                              >
                                ({data?._id?.discount} % off)
                              </p>
                            </>
                          )}
                        </div>

                        {index === isIndex && loadingQuantity ? (
                          <Spinner />
                        ) : (
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                          >
                            <Form>
                              <Form.Label>Quantity</Form.Label>
                              <Form.Select
                                value={data?.quantity}
                                onChange={(e) => (
                                  handleQuantityChange(
                                    data?._id?._id,
                                    e.target.value
                                  ),
                                  setIndex(index)
                                )}
                              >
                                {[...Array(data?._id?.quantity).keys()].map(
                                  (quantity) => (
                                    <option key={quantity} value={quantity + 1}>
                                      {quantity + 1}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                            </Form>
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="col-md  bg-dark text-white p-3">
                <div className="price-details-container">
                  <div className="price-detail">
                    <CouponApply
                      setCartValue={setCartValue}
                      cartValue={cartValue}
                    />
                  </div>
                  <p className="price-details-heading">
                    PRICE DETAILS ({cartValue?.products?.length} items)
                  </p>

                  <div className="price-details">
                    <div className="price-detail">
                      <span>Total MRP</span>
                      <span>Rs.{TotalMRP()}</span>
                    </div>
                    <div className="price-detail">
                      <span>Discount on MRP</span>
                      <span>
                        - Rs.{(TotalMRP() - DiscountonMRP()).toFixed(2)}
                      </span>
                    </div>
                    <div className="price-detail">
                      <span>Coupon</span>
                      <span>
                        {cartValue?.appliedCouponDiscount !== undefined
                          ? `- Rs.${cartValue?.appliedCouponDiscount}`
                          : "Rs.0"}
                      </span>
                    </div>
                    <div className="price-detail">
                      <span>Delivery Fee</span>
                      <span>Rs.{ShippingFee()}</span>
                    </div>
                    <hr />
                    <div className="total-amount">
                      <span>Total Amount</span>
                      <span>Rs.{cartValue?.total}</span>
                    </div>
                    <hr />
                    <div className=" mt-5">
                      <Button
                        style={{
                          width: "100%",
                          backgroundColor: "#f78000",
                          border: "none",
                          fontSize: "20px",
                          fontWeight: "bolder",
                        }}
                        onClick={placeorderCheack}
                        disabled={loadingCheck}
                      >
                        Place Order {loadingCheck && <Spinner size="sm" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      )}
    </div>
  );
}

export default Cart;
