//
import { useSelector } from "react-redux";
import ADashboard from "../components/ADashboard";
import ACategory from "../components/ACategory";
import AProduct from "../components/AProduct";
import AOrder from "../components/AOrder";
import ACustomer from "../components/ACustomer";
import { Route, Routes } from "react-router-dom";
import Login from "../../component/Login";
import Register from "../../component/Register";
import Profile from "../../component/Profile";
import Four04 from "../../component/Four04";
import { selectUserInfo } from "../../redux/slices/userInfo";

function ARouteLinks() {
  const { login, role } = useSelector(selectUserInfo);

  return (
    <div
      style={{
        minHeight: "93vh",
        width: "100%",
      }}
    >
      <Routes>
        <Route path="/" element={<ADashboard />} />
        {!login && !role && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="/dashboard" element={<ADashboard />} />
        <Route path="/category" element={<ACategory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product" element={<AProduct />} />
        <Route path="/order" element={<AOrder />} />
        <Route path="/customer" element={<ACustomer />} />
        <Route path="*" element={<Four04 />} />
      </Routes>
    </div>
  );
}

export default ARouteLinks;
