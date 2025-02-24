import React from "react";
import logo from "../../assets/Logo.svg";

function Logo({ css = "max-w-[138px]" }) {
  return <img className={`${css}`} src={logo} alt="logo" />;
}

export default Logo;
