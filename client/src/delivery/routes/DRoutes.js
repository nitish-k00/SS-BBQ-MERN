import React from "react";
import { Route, Routes } from "react-router-dom";
import Four04 from "../../user/component/Four04";
import DDashBoard from "../component/DDashBoard";

function DRoutes() {
  return (
    <div
      style={{
        minHeight: "93vh",
        width: "100%",
      }}
    >
      <Routes>
        <Route path="/" element={<DDashBoard />} />
        <Route path="*" element={<Four04 />} />
      </Routes>
    </div>
  );
}

export default DRoutes;
