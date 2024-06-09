import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Logout from "../../user/component/logout";

function DNavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "#003049" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <span>
            <h2 style={{ color: "#f78000" }} className="me-2">
              SS BBQ
            </h2>
          </span>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DELIVERY
          </Typography>
          <Button color="inherit">
            <Logout />
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default DNavBar;
