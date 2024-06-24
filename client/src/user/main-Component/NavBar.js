import React, { useEffect, useState } from "react";
import "../../index.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logout from "../component/logout";

//

import { selectUserInfo } from "../../redux/slices/userInfo";
import { useSelector } from "react-redux";

const pages = ["MENU", "FAVOURITES", "CART"];

function NavBar() {
  //
  const { login, avator } = useSelector(selectUserInfo);
  //
  const location = useLocation();
  // console.log(location.pathname);
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar class="main" style={{ color: "white", width: "100%" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{ display: { xs: "none", md: "flex" }, mr: 1, color: "white" }}
          >
            <img
              src="/img/logo.png"
              style={{
                width: "40px",
                display: "flex",
                marginRight: 1,
                color: "white",
              }}
            />
          </Box>

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
            }}
          >
            SS/BBQ
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to={page.toLocaleLowerCase()}>
                      <Button
                        style={{
                          color: "white",
                          width: "100px",
                          fontWeight: "bold",
                          backgroundColor:
                            location.pathname === `/${page.toLocaleLowerCase()}`
                              ? "#913b3bfc"
                              : " #003049",
                        }}
                      >
                        {page}
                      </Button>
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{ display: { xs: "flex", md: "none" }, mr: 1, color: "white" }}
          >
            <img
              src="/img/logo.png"
              style={{
                width: "40px",
                display: "flex",
                marginRight: 1,
                color: "white",
              }}
            />
          </Box>
          <Typography
            variant="h5"
            noWrap
            to="/"
            component={Link}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SS/BBQ
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link to={page.toLocaleLowerCase()}>
                  <Button
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      backgroundColor:
                        location.pathname === `/${page.toLocaleLowerCase()}` &&
                        "#913b3bfc",
                    }}
                  >
                    {page}
                  </Button>
                </Link>
              </Button>
            ))}
          </Box>

          {login ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    style={{ backgroundColor: "white" }}
                    src={avator && avator}
                  />
                </IconButton>
              </Tooltip>
              {/* Conditionally render the user menu */}
              {anchorElUser && (
                <Menu
                  sx={{ mt: "55px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    sx={{ textAlign: "center" }}
                  >
                    <Link to="/profile">
                      <Button
                        className="bg-primary"
                        style={{ color: "white", width: "100px" }}
                      >
                        Profile
                      </Button>
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    sx={{ textAlign: "center" }}
                  >
                    <Link to="/Orders">
                      <Button
                        className="bg-primary"
                        style={{ color: "white", width: "100px" }}
                      >
                        Orders
                      </Button>
                    </Link>
                  </MenuItem>
                  <MenuItem sx={{ textAlign: "center" }}>
                    <Logout />
                  </MenuItem>
                </Menu>
              )}
            </Box>
          ) : (
            <div className=" p-2">
              <span
                className=""
                style={{ fontWeight: "700", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
              <span
                className=" mx-2 "
                style={{ fontWeight: "700", color: "white" }}
              >
                /
              </span>
              <span
                className="ml-2 "
                style={{ fontWeight: "700", cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
