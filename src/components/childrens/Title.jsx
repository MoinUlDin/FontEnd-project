import React from "react";

function Title({ children, css = "" }) {
  return (
    <h1
      className={`${css} text-2xl mb-10 md:text-4xl md:font-bold font-semibold`}
    >
      {children}
    </h1>
  );
}

export default Title;
