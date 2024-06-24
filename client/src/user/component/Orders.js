import React, { useEffect, useState } from "react";
import { userOrders } from "../middleware/API";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: "#f9f9f9",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const OrderTitle = styled(Typography)(({ theme }) => ({
  color: "#913b3bfc",
  marginBottom: theme.spacing(3),
}));

const OrderDate = styled(Typography)(({ theme }) => ({
  color: "#3f51b5",
  marginBottom: theme.spacing(1),
}));

const PaymentStatus = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const CouponDiscount = styled(Typography)(({ theme }) => ({
  color: "#ff9800",
  marginBottom: theme.spacing(1),
}));

const TotalPrice = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const ProductName = styled(Typography)(({ theme }) => ({
  color: "#3f51b5",
  marginBottom: theme.spacing(1),
}));

const SpinnerContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh",
});

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await userOrders();
      setOrders(response.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <OrderTitle variant="h4" gutterBottom>
        My Orders
      </OrderTitle>
      {loading ? (
        <SpinnerContainer>
          <CircularProgress />
        </SpinnerContainer>
      ) : orders.length > 0 ? (
        orders.map((order, index) => (
          <StyledPaper key={index}>
            <OrderDate variant="h6">
              Order Date: {new Date(order.orderDate).toLocaleString()}
            </OrderDate>
            <PaymentStatus variant="subtitle1">
              Payment Status:{" "}
              <span
                style={{
                  color: order.paymentStatus === "completed" ? "green" : "red",
                }}
              >
                {order.paymentStatus}
              </span>
            </PaymentStatus>
            <CouponDiscount variant="subtitle1">
              Coupon Discount: - Rs.{order.coupon || 0}
            </CouponDiscount>
            <TotalPrice variant="subtitle1">Total: Rs.{order.total}</TotalPrice>
            <Grid container spacing={2}>
              {order.products.map((productItem, idx) => (
                <Grid item xs={12} md={6} lg={4} key={idx}>
                  <StyledCard>
                    <CardMedia
                      component="img"
                      height="140"
                      image={productItem.product.photo[0]}
                      alt={productItem.product.name}
                    />
                    <CardContent>
                      <ProductName variant="h6">
                        {productItem.product.name}
                      </ProductName>
                      <Typography variant="body2" color="text.secondary">
                        Price: Rs.{productItem.product.discountPrice}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {productItem.quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status:{" "}
                        <span
                          style={{
                            color:
                              productItem.orderStatus !== "created"
                                ? "green"
                                : "orange",
                          }}
                        >
                          {productItem.orderStatus}
                        </span>
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </StyledPaper>
        ))
      ) : (
        <Typography variant="subtitle1" color="text.secondary">
          No orders found.
        </Typography>
      )}
    </Container>
  );
}

export default Orders;
