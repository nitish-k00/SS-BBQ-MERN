import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "../component/Login";
import Cart from "../component/Cart";
import Home from "../component/Home";
import Menu from "../component/Menu";
import Profile from "../component/Profile";
import Register from "../component/Register";
import Favourite from "../component/Favourite";
import Four04 from "../component/Four04";
import Account from "../component/Account";
//
import { selectUserInfo } from "../redux/slices/userInfo";
import { useSelector } from "react-redux";
import SingleProductPage from "../component/SingleProductPage";
import PlaceOrder from "../component/PlaceOrder";
import Payment from "../component/Payment";
import ProtectedRoute from "../middleware/ProtectedRoute";

function RouteLinks() {
  const { login, role } = useSelector(selectUserInfo);

  return (
    <div
      style={{
        minHeight: "93vh",
        width: "100%",
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        {!login && !role && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favourites" element={<Favourite />} />
        <Route path="*" element={<Four04 />} />
        <Route path="/menu/:id" element={<SingleProductPage />} />
        <Route path="/account" element={<Account />} />
        <Route
          path="/placeorder"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default RouteLinks;
