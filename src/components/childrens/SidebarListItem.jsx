import React from "react";
import { NavLink } from "react-router-dom";
function SidebarListItem({ to, children, css = "", css1 = "" }) {
  return (
    <li className="css">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${isActive ? "text-blue-300 " : "text-white"} ${css1}`
        }
      >
        {children}
      </NavLink>
    </li>
  );
}

export default SidebarListItem;
