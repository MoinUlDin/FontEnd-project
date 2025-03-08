import React from "react";
import SidebarListItem from "./childrens/SidebarListItem"; // adjust the path as needed

const Sidebar = () => {
  return (
    <div className="px-4 sticky top-0">
      <h2 className=" text-xl  text-center font-bold mb-4 p-[18px] border-b border-b-gray-300 -mx-4">
        Dashboard
      </h2>
      <nav>
        <ul className="space-y-2">
          <SidebarListItem to="/dashboard/templates">Templates</SidebarListItem>
          <SidebarListItem to="/dashboard/assesments">
            Assesments
          </SidebarListItem>
          <SidebarListItem to="/dashboard/users">Users</SidebarListItem>
          <SidebarListItem to="/dashboard/settings">Settings</SidebarListItem>
          <SidebarListItem to="/dashboard/help">Help</SidebarListItem>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
