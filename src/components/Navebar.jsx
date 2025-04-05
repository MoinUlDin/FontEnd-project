import React, { useState } from "react";
import Logo from "../components/childrens/Logo";
import NavLinks from "../components/childrens/NavLinks";
import PrimaryShellbtn from "../components/childrens/PrimaryShellbtn";
import Primarybtn from "../components/childrens/Primarybtn";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";

function Navebar() {
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full h-15 bg-gray-100 px-10 flex items-center justify-between mt-2 mb-4 md:mb-8 relative">
      <Logo />

      {/* Desktop Navigation */}
      <div className="hidden md:block grow ">
        <NavLinks />
      </div>

      {/* Sign-in Buttons for Desktop */}
      <div className="hidden md:flex">
        <PrimaryShellbtn chref="/login">Sign In</PrimaryShellbtn>
        <Primarybtn chref="/register">Sign Up</Primarybtn>
      </div>

      {/* Hamburger Button */}
      <button onClick={() => setOpen(!open)} className="md:hidden">
        {!open && (
          <div className="space-y-1">
            <div className="w-6 h-1 bg-black"></div>
            <div className="w-6 h-1 bg-black"></div>
            <div className="w-6 h-1 bg-black"></div>
          </div>
        )}
      </button>

      {/* Mobile Menu - Slides in from the Right */}
      <div
        className={`fixed z-100 top-0 right-0 h-screen w-2/3 bg-gray-500 text-white p-6 transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <NavLinks fn={setOpen} mobile={true} />
      </div>
    </nav>
  );
}

export default Navebar;
