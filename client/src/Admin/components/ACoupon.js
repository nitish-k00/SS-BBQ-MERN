import { Button, Container } from "@mui/material";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import CouponForm from "../middleware/CouponForm";
import CouponTable from "../middleware/CouponTable";
import { allCoupon } from "../middleware/API";
import Spinner from "react-bootstrap/esm/Spinner";

function ACoupon() {
  const [ismodelopen, setIsModelOpen] = useState(false);
  const [formData, setFormData] = useState({
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
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllCoupon = async () => {
    setLoading(true);
    try {
      const response = await allCoupon();
      setCoupons(response);
    } catch (error) {
      console.log();
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllCoupon();
    console.log("called");
  }, []);

  return (
    <Container className="my-3">
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "200px" }}>
          <h2>
            LOADING <Spinner animation="border" role="status" />
          </h2>
        </div>
      ) : (
        <>
          <Button
            className="bg-primary mb-4"
            style={{ color: "white" }}
            onClick={() => setIsModelOpen(true)}
          >
            Create Coupon
          </Button>

          <CouponTable setCoupons={setCoupons} coupons={coupons} />

          <Modal
            title="Create Coupon"
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
        </>
      )}
    </Container>
  );
}

export default ACoupon;
