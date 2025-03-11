import React from "react";
import { Link } from "react-router-dom";

function PrimaryShellbtn({ children, chref = "/home", css = "" }) {
  return (
    <Link
      to={chref}
      className={`${css} outline-1 outline-blue-600 mx-2 md:mx6 hover:bg-sunglow hover:text-black hover:outline-sunglow hover:cursor-pointer text-blue-500 md:font-semibold py-1 px-2 md:py-2 md:px-3 lg:px-8 rounded-3xl Transition-colors duration-300 text-12 md:text-[clamp(10px, text-14 + vw, 18px)] flex items-center justify-center`}
    >
      {children}
    </Link>
  );
}

export default PrimaryShellbtn;
