import React from "react";
import { Link } from "react-router-dom";

function Primarybtn({ children, chref = "/home", css = "" }) {
  return (
    <Link
      to={chref}
      className={`${css} bg-blue-500  text-white hover:bg-sunglow hover:text-black hover:outline-sunglow hover:cursor-pointer md:font-semibold py-2 px-3 md:py-3 md:px-4 lg:px-10 rounded-3xl Transition-colors duration-300 text-10 md:text-[clamp(10px, text-14 + vw, 18px)] flex items-center justify-center`}
    >
      {children}
    </Link>
  );
}

export default Primarybtn;
