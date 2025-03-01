import React from "react";
import logo from "../assets/Logo.svg";
import Primarybtn from "./childrens/Primarybtn";
import PrimaryShellbtn from "./childrens/PrimaryShellbtn";
import ListItem from "./childrens/ListItem";
import Logo from "./childrens/Logo";
import { useSelector } from "react-redux";

function Navebar() {
  const user = useSelector((state) => state.auth.user);
  console.log("user:", user);
  return (
    <nav className="w-full h-15 bg-gray-100 px-10 flex items-center justify-between mt-2 mb-4 md:mb-8">
      <Logo />
      <ul className="flex justify-evenly grow space-x-4">
        <ListItem href="/">Home</ListItem>
        <ListItem href="/users/assesment-test/">Pricing</ListItem>
        <ListItem href="About">About Us</ListItem>
        <ListItem href="contact">Contact Us</ListItem>
        {user ? <ListItem href="dashboard/templates"> Dashboard</ListItem> : ""}
      </ul>
      <div className="flex">
        <PrimaryShellbtn chref="/login">Sign In</PrimaryShellbtn>
        <Primarybtn chref="/register">Sign Up</Primarybtn>
      </div>
    </nav>
  );
}

export default Navebar;
