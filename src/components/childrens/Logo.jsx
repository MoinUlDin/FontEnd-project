import React from "react";
import logo from "../../assets/Logo.svg";

function Logo({ css = "md:max-w-[138px] w-[90px] md:w-[120px]" }) {
  return <img className={`${css}`} src={logo} alt="logo" />;
}

export default Logo;
