import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetSingleUsers, userOrders } from "./API";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Button } from "react-bootstrap";

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

const UserInfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: "#f0f0f0",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.shape.borderRadius,
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: "#f9f9f9",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
}));

const chartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      type: "category",
      title: {
        display: true,
        text: "Product",
      },
    },
    y: {
      type: "linear",
      title: {
        display: true,
        text: "Number of Purchases",
      },
      beginAtZero: true,
    },
  },
};

function UserInfo() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [user, setUser] = useState({});
  const [loadingUser, setLoadingUser] = useState(false);
  const [productData, setProductData] = useState(null);
  const [purchaseDayData, setPurchaseDayData] = useState(null);
  const [totalProductsOrdered, setTotalProductsOrdered] = useState(0);
  const [totalMoneySpent, setTotalMoneySpent] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchUser();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      calculateTotals(orders);
      generateProductData(orders);
      generatePurchaseDayData(orders);
    }
  }, [orders]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await userOrders(id);
      setOrders(response.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoadingOrders(false);
  };

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const response = await GetSingleUsers(id);
      setUser(response);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    setLoadingUser(false);
  };

  const calculateTotals = (orders) => {
    let totalProducts = 0;
    let totalAmount = 0;

    orders.forEach((order) => {
      order.products.forEach((productItem) => {
        totalProducts += productItem.quantity;
        totalAmount += productItem.quantity * productItem.product.discountPrice;
      });
    });

    setTotalProductsOrdered(totalProducts);
    setTotalMoneySpent(totalAmount);
  };

  const generateProductData = (orders) => {
    const productCount = {};
    orders.forEach((order) => {
      order.products.forEach((productItem) => {
        const productName = productItem.product.name;
        if (productCount[productName]) {
          productCount[productName]++;
        } else {
          productCount[productName] = 1;
        }
      });
    });

    const labels = Object.keys(productCount);
    const data = Object.values(productCount);

    const productChartData = {
      labels: labels,
      datasets: [
        {
          label: "Number of Purchases",
          data: data,
          backgroundColor: "#3f51b5",
        },
      ],
    };

    setProductData(productChartData);
  };

  const generatePurchaseDayData = (orders) => {
    const dayCount = {};
    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const dayOfWeek = orderDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      if (dayCount[dayOfWeek]) {
        dayCount[dayOfWeek]++;
      } else {
        dayCount[dayOfWeek] = 1;
      }
    });

    const labels = Object.keys(dayCount);
    const data = Object.values(dayCount);

    const purchaseDayChartData = {
      labels: labels,
      datasets: [
        {
          label: "Number of Purchases",
          data: data,
          backgroundColor: "#4caf50",
        },
      ],
    };

    setPurchaseDayData(purchaseDayChartData);
  };

  return (
    <Container className="my-3">
      <Button
        variant="primary"
        onClick={() => navigate("/customer")}
        className="mb-4"
      >
        Go Back
      </Button>
      <UserInfoBox>
        {loadingUser ? (
          <SpinnerContainer>
            <CircularProgress />
          </SpinnerContainer>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                gutterBottom
                style={{ color: "#f78000" }}
              >
                User Information
              </Typography>
              <Typography variant="h6" gutterBottom>
                Name: {user.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Email: {user.email}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ maxWidth: "500px" }}
              >
                MapAddress: {user.MapAddress}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Address: {user.address}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Phone: {user.phone}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                height="100%"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  width="200px"
                  height="200px"
                  borderRadius="50%"
                  color="white"
                  textAlign="center"
                  style={{ backgroundColor: "orange" }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{
                      fontWeight: "bolder",
                      fontSize: "30px",
                      color: "black",
                    }}
                  >
                    {totalProductsOrdered}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{
                      fontWeight: "bolder",
                      fontSize: "20px",
                    }}
                  >
                    Total Products
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  width="200px"
                  height="200px"
                  borderRadius="50%"
                  color="white"
                  textAlign="center"
                  style={{ backgroundColor: "orange" }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{
                      fontWeight: "bolder",
                      fontSize: "30px",
                      color: "black",
                    }}
                  >
                    {totalMoneySpent}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={{ fontWeight: "bolder", fontSize: "20px" }}
                  >
                    Money Spent
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </UserInfoBox>

      <ChartContainer>
        <Typography variant="h5" gutterBottom>
          Highly Purchased Products
        </Typography>
        {productData ? (
          <Bar data={productData} options={chartOptions} />
        ) : (
          <Typography variant="subtitle1" color="text.secondary">
            Loading...
          </Typography>
        )}
      </ChartContainer>

      <StyledPaper>
        <OrderTitle variant="h4" gutterBottom>
          My Orders
        </OrderTitle>
        {loadingOrders ? (
          <SpinnerContainer>
            <CircularProgress />
          </SpinnerContainer>
        ) : orders.length > 0 ? (
          <>
            {orders.map((order, index) => (
              <Paper key={index} sx={{ mb: 3, p: 3 }}>
                <OrderDate variant="h6">
                  Order Date: {new Date(order.orderDate).toLocaleString()}
                </OrderDate>
                <PaymentStatus variant="subtitle1">
                  Payment Status:{" "}
                  <span
                    style={{
                      color:
                        order.paymentStatus === "completed" ? "green" : "red",
                    }}
                  >
                    {order.paymentStatus}
                  </span>
                </PaymentStatus>
                <CouponDiscount variant="subtitle1">
                  Coupon Discount: - Rs.{order.coupon || 0}
                </CouponDiscount>
                <TotalPrice variant="subtitle1">
                  Total: Rs.{order.total}
                </TotalPrice>
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutter
                            gutterBottom
                          >
                            Price: Rs.{productItem.product.discountPrice}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Quantity: {productItem.quantity}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
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
              </Paper>
            ))}
          </>
        ) : (
          <Typography variant="subtitle1" color="text.secondary">
            No orders found.
          </Typography>
        )}
      </StyledPaper>

      <ChartContainer>
        <Typography variant="h5" gutterBottom>
          Most Frequent Purchase Day
        </Typography>
        {purchaseDayData ? (
          <Bar data={purchaseDayData} options={chartOptions} />
        ) : (
          <Typography variant="subtitle1" color="text.secondary">
            Loading...
          </Typography>
        )}
      </ChartContainer>
    </Container>
  );
}

export default UserInfo;
