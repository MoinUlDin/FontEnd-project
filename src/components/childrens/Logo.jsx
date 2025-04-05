import React from "react";
import logo from "../../assets/png.png";
// md:max-w-[138px] w-[90px] md:w-[120px]
function Logo({ css = "h-11 md:h-12 lg:h-14" }) {
  return <img className={`${css}`} src={logo} alt="logo" />;
}

export default Logo;
