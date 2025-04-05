// src/components/DashboardLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logoutAndClear, login } from "../features/authslice";
import defualt_img from "../assets/profile_img.png";
import apiClient from "../services/apiClient";
import { fetchList } from "../features/companySlice";
import { ImSpinner8 } from "react-icons/im";

const DashboardLayout = () => {
  // Access user data from Redux store
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.company.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCredits, setShowCredits] = useState(false);
  const [loading, setLoading] = useState(false);

  // On mount, if user is not in Redux store, check localStorage and dispatch login.
  useEffect(() => {
    if (!user) {
      const userdata = localStorage.getItem("userData");
      if (userdata) {
        try {
          const parsedData = JSON.parse(userdata);
          console.log("Sending user data:", parsedData);
          dispatch(login(parsedData));
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          dispatch(logoutAndClear());
          navigate("/login");
        }
      } else {
        dispatch(logoutAndClear());
        navigate("/login");
      }
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
      setShowCredits(false);
    } else {
      setShowCredits(true);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/company/")
      .then((res) => {
        dispatch(fetchList(res.data));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, dispatch]);

  const handleClick = () => {
    navigate("/dashboard/price");
  };

  // Local state to toggle the dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Create a ref for the dropdown container
  const dropdownRef = useRef(null);

  let title = "";
  if (location.pathname.includes("/dashboard/templates")) {
    title = "Templates";
  } else if (location.pathname.includes("/dashboard/assesments")) {
    title = "Assesments";
  } else if (location.pathname.includes("/dashboard/users")) {
    title = "Users";
  } else if (location.pathname.includes("/dashboard/settings")) {
    title = "Settings";
  } else if (location.pathname.includes("/dashboard/help")) {
    title = "Help";
  } else {
    title = "Dashboard";
  }

  const handleLogout = () => {
    dispatch(logoutAndClear());
    navigate("/login");
  };

  // Listen for clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar: fixed width and always visible */}
      <aside>
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden bg-gray-100 w-[calc(100svw - 200px)]">
        {/* Sticky header with user info */}
        <div className="sticky top-0 z-10 bg-gray-100 p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="hidden md:block text-2xl font-bold">{title}</h1>

          {showCredits && (
            <div className="flex gap-0.5 sm:gap-2 justify-center items-center text-sm md:text-lg font-bold">
              <span>Credits:</span>
              <span className="flex justify-between items-center gap-1 ptr">
                {company[0]?.credits}
                <span onClick={handleClick} className="text-2xl text-blue-800">
                  +
                </span>
              </span>
            </div>
          )}
          {/* Profile Button & Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center hover:cursor-pointer focus:outline-none mr-2 md:mr-4"
            >
              <div className="flex flex-col items-center justify-end">
                <span className="ml-2 capitalize mr-2 md:mr-4 sm:text-[12px] sm:text-sm md:text-lg font-medium text-gray-700">
                  {user?.userName || "User"}
                </span>
                <span className="text-[8px] sm:text-[10px] italic">
                  {user?.company}
                </span>
              </div>
              <img
                src={user?.profilePicture || defualt_img}
                alt="Profile"
                className="rounded-full h-8 w-8 hover:scale-110"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <Link
                  to="/dashboard/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic main content rendered here */}
        <div className="md:p-6 sm:p-4 p-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
