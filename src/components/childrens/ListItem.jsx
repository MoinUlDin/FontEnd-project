import React from "react";

function ListItem({ children, href, css = "" }) {
  return (
    <li
      className={`${css} hover:cursor-pointer font-semibold text-[#28296C] hover:text-[#EB1C35] Transition-colors duration-300`}
    >
      <a href={href}>{children}</a>
    </li>
  );
}

export default ListItem;
