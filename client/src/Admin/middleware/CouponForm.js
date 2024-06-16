import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Container,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { createCoupon, editCoupon } from "./API";
import Spinner from "react-bootstrap/Spinner";
import { Form } from "react-bootstrap";

const CouponForm = ({ formData, setFormData, setIsModelOpen, setCoupons }) => {
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleKeyDown = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = formData._id
        ? await editCoupon(formData)
        : await createCoupon(formData);

      console.log(response);
      setCoupons((prevCoupons) => {
        if (formData._id) {
          // Edit mode
          return prevCoupons.map((coupon) =>
            coupon._id === formData._id ? response : coupon
          );
        } else {
          // Create mode
          return [...prevCoupons, response];
        }
      });
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        expiryDate: "",
        maxUses: "",
        uses: 0,
        active: true,
        minOrderValue: "",
      });
      setIsModelOpen(false);
    } catch (error) {
      console.error("Failed to create coupon:", error);
    }
    setLoading(false);
  };

  return (
    <Container className="mt-3">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Discount Type"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              select
              fullWidth
              required
            >
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="fixed">Fixed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Discount Value"
              name="discountValue"
              type="number"
              value={formData.discountValue}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                endAdornment:
                  formData.discountType === "percentage" ? "%" : "₹",
                inputProps: {
                  min: formData.discountType === "percentage" ? 0 : undefined,
                  max: formData.discountType === "percentage" ? 100 : undefined,
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Expiry Date"
              name="expiryDate"
              type="datetime-local"
              value={formData.expiryDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              onKeyDown={handleKeyDown}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Max Uses"
              name="maxUses"
              type="number"
              value={formData.maxUses}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Min Order Value"
              name="minOrderValue"
              type="number"
              value={formData.minOrderValue}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Form.Group className="mt-3 ms-4">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.active}
                  onChange={handleChange}
                  name="active"
                  color="primary"
                />
              }
              label="Active"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {formData._id ? "Edit Coupon" : "Create Coupon"}
              {loading && <Spinner size="sm" style={{ color: "white" }} />}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CouponForm;
