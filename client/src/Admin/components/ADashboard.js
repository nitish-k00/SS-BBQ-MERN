import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import islogin from '../../middleware/isLogin';
import { profileInfo } from '../../middleware/API';
import { modifyUserInfo } from '../../redux/slices/userInfo';
import axios from 'axios';

function ADashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedJWT = islogin();
        if (decodedJWT !== null) {
          const userData = await profileInfo();
          dispatch(
            modifyUserInfo({
              name: userData.name,
              email: userData.email,
              address: userData.address,
              phoneNo: userData.phoneNo,
              avator: userData.avator,
              role: decodedJWT.role,
              login: !!decodedJWT,
            })
          );
          try {
            await axios.post("http://localhost:8000/auth/removeUiToken");
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  console.log("1")
  return (
    <div>ADashboard</div>
  )
}

export default ADashboard