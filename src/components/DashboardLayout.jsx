import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logoutAndClear } from "../features/authslice";
import defualt_img from "../assets/profile_img.png";
import { useNavigate, useLocation, Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import { fetchList } from "../features/companySlice";
const DashboardLayout = () => {
  // Access user data from Redux store
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.company.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCredits, setShowCredits] = useState(false);
  const [loading, setLoading] = useState(false);

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
  }, [user]);

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
    // Dispatch the logout action
    dispatch(logoutAndClear());
    navigate("/");
  };

  // Listen for clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown is open and the click target is outside of the dropdown, close it.
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
      <main className="flex-1 bg-gray-100">
        {/* Sticky header with user info */}
        <div className="sticky top-0 z-10 bg-gray-100 p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="hidden md:block text-2xl font-bold">{title}</h1>

          {showCredits && (
            <div className="flex gap-2 justify-center items-center text-2xl md:text-lg font-bold ">
              <span>Credits:</span>
              <span className="flex justify-between items-center gap-1 ptr">
                {company[0]?.credits}
                <span onClick={handleClick} className="text-2xl text-blue-800">
                  +
                </span>
              </span>
            </div>
          )}
          {/* Wrap the profile button and dropdown in a ref */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center hover:cursor-pointer focus:outline-none mr-2 md:mr-4"
            >
              <div className="flex flex-col items-center justify-end">
                <span className="ml-2 capitalize mr-2 md:mr-4 font-medium text-gray-700">
                  {user?.userName || "User"}
                </span>
                <span className="text-[10px] italic ">{user?.company}</span>
              </div>
              <img
                src={user?.profilePicture || defualt_img}
                alt="Profile"
                className="w-8 h-8 rounded-full hover:scale-110"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <Link
                  to="/dashboard/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <a
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
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
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
