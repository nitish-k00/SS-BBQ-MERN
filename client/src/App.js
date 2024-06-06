import Footer from "./main-Component/Footer";
import NavBar from "./main-Component/NavBar";
import ANavbar from "./Admin/main-component/ANavbar";
import ARouteLinks from "./Admin/route/ARoute";

import { BrowserRouter as Router } from "react-router-dom";
import RouteLinks from "./route/Route";
//
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUserInfo } from "./redux/slices/userInfo";
//
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


axios.defaults.withCredentials = true;

function App() {
  const user = useSelector(selectUserInfo);
  console.log(user);
  return (
    <div>
      <Router>
        {user.role === 1 ? <ANavbar /> : <NavBar />}
        {user.role === 1 ? <ARouteLinks /> : <RouteLinks />}
        <Footer />
        <ToastContainer autoClose={1000} />
      </Router>
    </div>
  );
}

export default App;
