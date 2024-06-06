import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link, useNavigate } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import "../index.css";
import { loginValidation } from "../middleware/formValidation";
function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gloading, setGLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();

  const onChangeUserData = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
    setError("");
  };

  useEffect(() => {
    setFormError({});
  }, [userData]);

  const onSubmitForm = async () => {
    setLoading(true);
    try {
      if (!loginValidation(userData, setFormError)) {
        setLoading(false);
        return;
      }
      await axios.post("http://localhost:8000/auth/login", userData);
      navigate("/");
      setError("");
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message);
      } else {
        setError(error.response?.data?.message);
      }
    }
    setLoading(false);
  };

  const onclickGoogleAuth = () => {
    setGLoading(true);
    try {
      window.location.href = "http://localhost:8000/auth/google";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "inherit",
      }}
      className="loingbg "
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "40px 20px",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          margin: "30px 0px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="mb-3 ">
          <h1
            style={{
              borderRadius: "0.25rem",
            }}
            className="p-3 radius-1 main bg1 "
          >
            WELCOME BACK
            {/* <img src="/img/chicken.png" style={{ width: "20vh" }}></img> */}
          </h1>
        </div>

        <Grid container spacing={2} direction="column" alignItems="center">
          <Grid item style={{ width: "100%" }}>
            {["email", "password"].map((value) => (
              <TextField
                key={value}
                label={value.charAt(0).toUpperCase() + value.slice(1)}
                name={value}
                variant="outlined"
                type={value === "password" ? "password" : "text"}
                required
                onChange={onChangeUserData}
                error={!!formError[value]}
                helperText={formError[value]}
                style={{ width: "100%", marginBottom: "20px" }}
              />
            ))}
          </Grid>
          <Grid
            item
            style={{ width: "100%", textAlign: "left", marginTop: "0px" }}
          >
            <Button
              variant="text"
              color="primary"
              component={Link}
              to="/"
              style={{ marginBottom: "20px" }}
            >
              Forgot Password
            </Button>
          </Grid>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmitForm}
              fullWidth
              className="mb-2"
            >
              {loading ? (
                <Spinner animation="border" size="sm" role="status" />
              ) : (
                " Login"
              )}
            </Button>
            <p className="text-center">------- or -------</p>
            <Button
              variant="contained"
              fullWidth
              onClick={onclickGoogleAuth}
              style={{ width: "100%", backgroundColor: "black" }}
            >
              {gloading ? (
                <Spinner animation="border" size="sm" role="status" />
              ) : (
                <>
                  <img src="img/icons8-google-48.png" />
                  <span className="ms-2">login with Google</span>
                </>
              )}
            </Button>
          </div>
        </Grid>
        {error !== "" && (
          <Alert variant="danger" className="m-3 mt-5 ">
            {error}
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Login;
