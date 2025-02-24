import React from "react";

function PrimaryShellbtn({ children, chref = "/home", css = "" }) {
  return (
    <a
      href={chref}
      className={`${css} text-btn outline-1 outline-blue-600 mx-6 hover:bg-sunglow hover:text-black hover:outline-sunglow hover:cursor-pointer text-blue-500 py-3 px-8 rounded-3xl Transition-colors duration-300`}
    >
      {children}
    </a>
  );
}

export default PrimaryShellbtn;
