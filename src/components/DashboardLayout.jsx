import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logoutAndClear } from "../features/authslice";
import defualt_img from "../assets/profile_img.png";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  // Access user data from Redux store
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Local state to toggle the dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    // Optionally, redirect to the login page or clear tokens from storage
  };

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
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center hover:cursor-pointer focus:outline-none mr-2 md:mr-4"
            >
              <span className="ml-2 mr-2 md:mr-4 font-medium text-gray-700">
                {user?.userName || "User"}
              </span>
              <img
                src={user?.profilePicture || defualt_img}
                alt="Profile"
                className="w-8 h-8 rounded-full hover:scale-110"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <a
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
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
