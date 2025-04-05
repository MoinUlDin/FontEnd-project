import React from "react";

function Title({ children, css = "" }) {
  return (
    <h1
      className={`${css} text-xl sm:text-2xl mb-4 md:mb-6 md:text-4xl md:font-bold font-semibold`}
    >
      {children}
    </h1>
  );
}

export default Title;
