import React, { useEffect, useState } from "react";
import { CouponCartcheck } from "./API";

function ProductChart() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await CouponCartcheck();
        setProduct(Array.isArray(productData) ? productData : []);
      } catch (error) {
        console.log(error);
        setProduct([]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, []);

  console.log(product);

  return <div></div>;
}

export default ProductChart;
