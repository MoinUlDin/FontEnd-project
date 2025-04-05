import React from "react";

function Paragraph({ children, css = "" }) {
  return <p className={`${css} text-slate-900 mb-3 md:mb-6`}>{children}</p>;
}

export default Paragraph;
