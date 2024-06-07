import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import { Box, CircularProgress, Typography } from "@mui/material";
import "../index.css";

import { useDispatch, useSelector } from "react-redux";
import { modifyUserInfo, selectUserInfo } from "../redux/slices/userInfo";
import islogin from "../middleware/isLogin";
import { getFavColours, profileInfo, specialProduct } from "../middleware/API";
import axios from "axios";
import ProductBox from "../middleware/ProductBox";

function Home() {
  const dispatch = useDispatch();

  const [specialProducts, setSpecialProducts] = useState([]);
  const [specialProductLoding, setSpecialProductLoding] = useState(false);
  const [favID, setFavId] = useState([]);

  const userData = useSelector(selectUserInfo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedJWT = islogin();
        // console.log(decodedJWT);
        if (decodedJWT !== null) {
          const userData = await profileInfo();
          console.log(userData);
          dispatch(
            modifyUserInfo({
              name: userData.name,
              email: userData.email,
              address: userData.address,
              phoneNo: userData.phoneNo,
              avator: userData.avator,
              latitude: userData.latitude || "",
              longitude: userData.longitude || "",
              MapAddress: userData.MapAddress || "",
              role: decodedJWT.role,
              login: !!decodedJWT,
            })
          );
          try {
            await axios.post("http://localhost:8000/auth/removeUiToken");
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchSepicalProducts = async () => {
      setSpecialProductLoding(true);
      try {
        const SpecialP = await specialProduct();
        setSpecialProducts(SpecialP);
      } catch (error) {
        console.log(error);
      }
      setSpecialProductLoding(false);
    };
    fetchSepicalProducts();
  }, []);

  const holeFav = async () => {
    try {
      const data = await getFavColours();
      setFavId(data);
      console.log("called", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?.login) {
      holeFav();
    }
  }, [userData]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg mb-5"
    >
      <Container
        style={{
          width: "100%",
          marginTop: "5vh",
        }}
      >
        <div className="row ">
          <div className="col-md py-5">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "4rem", md: "6rem" },
                fontWeight: 700,
              }}
              className="head "
            >
              SS;
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
              }}
              className="pa"
            >
              BARBEQUE
            </Typography>
            <div
              style={{
                width: "70%",
                margin: "80px auto",
                padding: "20px",
                borderRadius: "10px",
                position: "relative",
              }}
              className="bg2"
            >
              <div className="box1"></div>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  fontFamily: "Arial",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                <div className="text-start">
                  <h3 style={{ fontWeight: "bolder" }}>
                    <img
                      className=""
                      src="/img/add.png"
                      style={{ width: "25%" }}
                      alt="BBQ Bliss Awaits"
                    ></img>
                    BBQ Bliss Awaits!
                  </h3>
                </div>
                " Smoky, succulent, and savory, BBQ tantalizes taste buds with
                its charred perfection "
              </Typography>
            </div>
            <div className="mt-5">
              <InstagramIcon
                sx={{
                  fontSize: 40,
                  color: "#C13584",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
              <FacebookIcon
                sx={{
                  fontSize: 40,
                  color: "#1877F2",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
              <EmailIcon
                sx={{
                  fontSize: 40,
                  color: "#EA4335",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
          <div className="col-md col-xl-5 d-flex justify-content-center align-items-center">
            <Box
              style={{
                backgroundColor: "#f78000",
                borderRadius: "30% 70% 74% 26% / 32% 67% 33% 68%",
                width: "100%",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <img
                src="img/bbq-removebg-preview.png"
                style={{
                  width: "80%",
                  borderRadius: "10px",
                }}
                alt="BBQ"
              />
            </Box>
          </div>
        </div>

        <Container className="mt-3">
          <div className="my-5 ms-4">
            {specialProductLoding ? (
              <CircularProgress />
            ) : (
              specialProducts.length !== 0 && (
                <div>
                  <h3 className="pa">SPEICAL OF THE DAY </h3>
                  <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start mt-5">
                    {specialProducts.map((product) => (
                      <ProductBox
                        key={product._id}
                        favID={favID}
                        holeFav={holeFav}
                        product={product}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default Home;
