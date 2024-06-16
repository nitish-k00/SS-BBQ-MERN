import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CouponForm from "./CouponForm";
import { Modal } from "antd";
import { deleteCoupon } from "./API";
import { Spinner } from "react-bootstrap";

const StyledTableCell = styled(TableCell)({
  padding: "10px",
});

const StyledTableHeaderCell = styled(TableCell)({
  padding: "10px",
  backgroundColor: "#f5f5f5",
  fontWeight: "bold",
});

const CouponTable = ({ setCoupons, coupons }) => {
  const [ismodelopen, setIsModelOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [DeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletes, setDeletes] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleEdit = (data) => {
    const date = new Date(data.expiryDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    setFormData({ ...data, expiryDate: formattedDate });
    setIsModelOpen(true);
  };

  const handleDelete = async (couponId) => {
    setLoadingDelete(true);
    try {
      const response = await deleteCoupon(couponId);
      setCoupons(coupons.filter((data) => data._id !== response._id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.log(error);
    }
    setLoadingDelete(false);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableHeaderCell>Code</StyledTableHeaderCell>
            <StyledTableHeaderCell>Description</StyledTableHeaderCell>
            <StyledTableHeaderCell>Discount Type</StyledTableHeaderCell>
            <StyledTableHeaderCell>Discount Value</StyledTableHeaderCell>
            <StyledTableHeaderCell>Expiry Date</StyledTableHeaderCell>
            <StyledTableHeaderCell>Max Uses</StyledTableHeaderCell>
            <StyledTableHeaderCell>Uses</StyledTableHeaderCell>
            <StyledTableHeaderCell>Active</StyledTableHeaderCell>
            <StyledTableHeaderCell>Min Order Value</StyledTableHeaderCell>
            <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons.map((coupon, index) => (
            <TableRow key={index}>
              <StyledTableCell>{coupon.code}</StyledTableCell>
              <StyledTableCell>{coupon?.description}</StyledTableCell>
              <StyledTableCell>{coupon.discountType}</StyledTableCell>
              <StyledTableCell>{coupon.discountValue}</StyledTableCell>
              <StyledTableCell>
                {new Date(coupon.expiryDate).toLocaleString()}
              </StyledTableCell>
              <StyledTableCell>{coupon.maxUses}</StyledTableCell>
              <StyledTableCell>{coupon.uses}</StyledTableCell>
              <StyledTableCell>{coupon.active ? "Yes" : "No"}</StyledTableCell>
              <StyledTableCell>{coupon.minOrderValue}</StyledTableCell>
              <StyledTableCell>
                <IconButton color="primary" onClick={() => handleEdit(coupon)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => (setDeletes(coupon), setDeleteModalOpen(true))}
                >
                  <DeleteIcon style={{ color: "red" }} />
                </IconButton>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        title="Edit Coupon"
        footer={null}
        open={ismodelopen}
        onCancel={() => setIsModelOpen(false)}
      >
        <CouponForm
          formData={formData}
          setFormData={setFormData}
          setIsModelOpen={setIsModelOpen}
          setCoupons={setCoupons}
        />
      </Modal>
      <Modal
        title="Disclaimer"
        footer={null}
        onCancel={() => (setDeleteModalOpen(false), setDeletes(""))}
        open={DeleteModalOpen}
        style={{ width: "400px" }}
      >
        <div style={{ padding: "20px" }}>
          <h2 style={{ marginBottom: "10px", color: "red" }}>Warning</h2>
          <h4 style={{ marginBottom: "10px" }}>-- {deletes.code} --</h4>
          <p>The Coupon will be permanently deleted.</p>
          <p>Are you sure about that?</p>
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(deletes._id)}
              disabled={loadingDelete}
            >
              {loadingDelete ? <Spinner animation="border" size="sm" /> : "YES"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              CANCEL
            </button>
          </div>
        </div>
      </Modal>
    </TableContainer>
  );
};

export default CouponTable;
