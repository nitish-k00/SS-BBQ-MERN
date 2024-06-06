import React, { useEffect, useState } from "react";
import ProductBox from "../middleware/ProductBox";
import { getFav } from "../middleware/API";
import { Button, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Favourite() {
  const [productFiltered, setProductFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFav = async () => {
    setLoading(true);
    try {
      const data = await getFav();
      setProductFiltered(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFav();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner animation="border" />
          <span>
            <p className="ms-2 h1">Loading....</p>
          </span>
        </div>
      ) : (
        <>
          <Container>
            <h2
              className="ms-5 mb-5 mt-3"
              style={{
                width: "100%",
                fontWeight: "bold",
                color: "#f78000",
                fontSize: "40px",
              }}
            >
              Favourite's
            </h2>
          </Container>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {productFiltered.length !== 0 ? (
              productFiltered.map((product) => (
                <ProductBox
                  key={product._id}
                  product={product}
                  setProductFiltered={setProductFiltered}
                />
              ))
            ) : (
              <div>
                <h5
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    color: "gray",
                    marginTop: "20px",
                  }}
                >
                  NO PRODUCT FOUND
                </h5>
                <Button
                  className="mt-3 bg-success "
                  onClick={() => navigate("/menu")}
                >
                  ADD YOUR FAVOURTIE
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Favourite;
