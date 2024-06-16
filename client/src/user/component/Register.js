import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import Otp from "../middleware/otp";
import { regValidate } from "../middleware/formValidation";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    newpassword: "",
    reenterpassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regValidate(formData, setErrors)) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/genrateotp",
        { email: formData.email, content: "registration" }
      );
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
      console.error("Error sending OTP:", error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "inherit",
      }}
      className="loingbg"
    >
      <Container maxWidth="md my-5">
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {!otpSent ? (
            <Grid item xs={12} md={6}>
              <form
                style={{
                  padding: "30px",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                {[
                  { name: "name", label: "Name", type: "text" },
                  { name: "email", label: "Email", type: "email" },
                  {
                    name: "newpassword",
                    label: "New Password",
                    type: "password",
                  },
                  {
                    name: "reenterpassword",
                    label: "Re-enter Password",
                    type: "password",
                  },
                ].map((field) => (
                  <TextField
                    key={field.name}
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    required
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                  />
                ))}
                <Button
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  fullWidth
                  style={{ marginTop: "20px" }}
                  onClick={handleRegister}
                >
                  {loading ? <CircularProgress size={24} /> : "Register"}
                </Button>
                {message && (
                  <Typography
                    variant="subtitle1"
                    color="error"
                    style={{ marginTop: "10px" }}
                  >
                    {message}
                  </Typography>
                )}
              </form>
            </Grid>
          ) : (
            <Otp formData={formData} handleRegister={handleRegister} />
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default Register;
