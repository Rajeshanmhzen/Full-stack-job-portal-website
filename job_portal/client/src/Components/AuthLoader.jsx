// src/components/AuthLoader.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../store/userSlice";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/user/user-detail`, {
          withCredentials: true,
        });
        dispatch(setUser(res.data.user));
      } catch (err) {
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, [dispatch]);

  return children;
};

export default AuthLoader;
