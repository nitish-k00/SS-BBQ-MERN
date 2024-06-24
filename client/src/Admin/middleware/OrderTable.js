import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Pagination,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"; // Correct import path
import { allOrdersDate } from "./API";

const OrderTable = ({
  orders,
  setOrders,
  totalPages,
  currentPage,
  setCurrentPage,
  handleEdit,
  handleDelete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("completed");
  const [orderDateFilter, setOrderDateFilter] = useState(null);

  useEffect(() => {
    filterOrders();
  }, [orders, paymentStatusFilter, orderDateFilter]);

  const filterOrders = () => {
    let filtered = orders;

    if (!filtered.length) {
      setFilteredOrders([]);
      return;
    }

    if (paymentStatusFilter) {
      filtered = filtered?.filter(
        (order) => order?.paymentStatus === paymentStatusFilter
      );
    }

    if (orderDateFilter) {
      filtered = filtered?.filter(
        (order) =>
          new Date(order?.orderDate).toLocaleDateString() ===
          new Date(orderDateFilter).toLocaleDateString()
      );
    }

    setFilteredOrders(filtered);
  };

  const fetchOrdersDate = async () => {
    try {
      const response = await allOrdersDate(orderDateFilter);
      setOrders(response.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (orderDateFilter !== null) fetchOrdersDate();
  }, [orderDateFilter]);

  return (
    <Box sx={{ padding: isMobile ? 2 : 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            label="Payment Status"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>
        {currentPage && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Order Date"
              value={orderDateFilter}
              onChange={(newValue) => setOrderDateFilter(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Serial No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Payment Method</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Payment Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Order Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order, index) => (
              <TableRow key={order._id}>
                <TableCell>
                  {currentPage ? (currentPage - 1) * 10 + index + 1 : index + 1}
                </TableCell>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>Rs.{order.total}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(order.orderId)}
                    sx={{ marginRight: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(order.orderId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {currentPage && !orderDateFilter && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Box>
      )}
    </Box>
  );
};

export default OrderTable;
