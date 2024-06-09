import React, { useEffect } from "react";
import { Typography, Container, Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Four04() {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigate("/");
  //   }, 5000);
  // });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Oops! Page not found.
        </Typography>
        <Typography variant="body1" gutterBottom>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{ marginTop: "20px" }}
        >
          Go back to Home
        </Button>
      </Box>
    </Container>
  );
}

export default Four04;
