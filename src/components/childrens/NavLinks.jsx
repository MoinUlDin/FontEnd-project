import React from "react";
import { Link } from "react-router-dom";
import PrimaryShellbtn from "../childrens/PrimaryShellbtn";
import Primarybtn from "../childrens/Primarybtn";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";

const NavLinks = ({ mobile = false, fn }) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <ul
      className={`flex relative ${
        mobile ? "flex-col pt-10 space-y-6 mt-10 z-500" : "space-x-4"
      } justify-evenly `}
    >
      {mobile && (
        <FiX
          onClick={() => fn(false)}
          className="text-4xl -top-7 absolute right-10"
        />
      )}
      <Link className="listItem text-white !important" to="/">
        Home
      </Link>
      <Link className="listItem" to="/users/assesment-test/">
        Pricing
      </Link>
      <Link className="listItem" to="/about">
        About Us
      </Link>
      <Link className="listItem" to="/contact">
        Contact Us
      </Link>
      {user && (
        <Link className="listItem" to="/dashboard/templates">
          Dashboard
        </Link>
      )}
      {mobile && (
        // In mobile, include sign in/up inside the menu.
        <div className="flex justify-center flex-col gap-3 items-center">
          <PrimaryShellbtn chref="/login">Sign In</PrimaryShellbtn>
          <Primarybtn chref="/register">Sign Up</Primarybtn>
        </div>
      )}
    </ul>
  );
};

export default NavLinks;
