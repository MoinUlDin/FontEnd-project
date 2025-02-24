import React from "react";

function Primarybtn({ children, chref = "/home", css = "" }) {
  return (
    <a
      href={chref}
      className={`${css} text-btn bg-blue-500  text-white hover:bg-sunglow hover:text-black hover:outline-sunglow hover:cursor-pointer font-semibold py-3 px-8 rounded-3xl Transition-colors duration-300`}
    >
      {children}
    </a>
  );
}

export default Primarybtn;
