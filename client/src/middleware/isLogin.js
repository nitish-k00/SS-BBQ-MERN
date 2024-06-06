import { jwtDecode } from "jwt-decode";

const islogin = () => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const jwtaccessCookie = cookies.find((cookie) =>
    cookie.startsWith("uiToken=")
  );
  if (jwtaccessCookie) {
    const jwtaccessValue = jwtaccessCookie.split("=")[1];
    const decodedJWT = jwtDecode(jwtaccessValue);
    return decodedJWT;
  }
  return null;
};

export default islogin;
