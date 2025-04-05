// src/components/AuthWatcher.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/authslice";

const AuthWatcher = ({ children, checkInterval = 2000 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedUser = localStorage.getItem("userData");
      if (!storedUser) {
        // If userData is removed, redirect to login.
        navigate("/login");
      } else {
        try {
          const parsed = JSON.parse(storedUser);
          // Check if parsed has a nested "user" object; if so, flatten it.
          let flattened;
          if (parsed.user) {
            flattened = {
              accessToken: parsed.accessToken,
              refreshToken: parsed.refreshToken,
              userName: parsed.user.userName,
              userId: parsed.user.userId,
              email: parsed.user.email,
              company: parsed.user.company,
              companyId: parsed.user.companyId,
              role: parsed.user.role,
            };
          } else {
            flattened = parsed;
          }
          // Check using the proper key: userName, etc.
          if (!currentUser?.userName || currentUser.email !== flattened.email) {
            console.log("Dispatching login with:", flattened);
            dispatch(login(flattened));
          }
        } catch (error) {
          console.error("Error parsing userData:", error);
        }
      }
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [navigate, checkInterval, dispatch, currentUser]);

  return children;
};

export default AuthWatcher;
