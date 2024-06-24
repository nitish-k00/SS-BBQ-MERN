import React, { useEffect, useState } from "react";
import { allOrders } from "../middleware/API";
import OrderTable from "../middleware/OrderTable";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

function AOrder() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    location?.state?.backpage !== undefined || null
      ? location?.state?.backpage
      : 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      console.log(currentPage, "currentPagefun");
      const response = await allOrders(currentPage);
      setOrders(response.orders);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  function handleEdit(id) {
    navigate(`/singleOrder/${id}`, {
      state: { currentPage: currentPage, page: "/order" },
    });
  }

  function handleDelete(id) {
    console.log("Delete:", id);
    // Add your delete logic here
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom className="mt-4 ms-4">
        Order Table
      </Typography>
      <OrderTable
        orders={orders}
        setOrders={setOrders}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default AOrder;
