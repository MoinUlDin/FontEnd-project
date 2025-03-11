import React from "react";
import SidebarListItem from "./childrens/SidebarListItem"; // adjust the path as needed
import {
  FiLayers,
  FiClipboard,
  FiUsers,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";
import {
  MdDescription,
  MdAssessment,
  MdPeople,
  MdSettings,
  MdHelpOutline,
} from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="px-4 min-h-screen sticky top-0 w-10 sm:w-17 md:w-46 lg:w-52 bg-gray-800 text-white">
      <h2 className=" text-xl   text-center font-bold mb-4 p-[18px] border-b border-b-gray-300 -mx-4 ">
        <span className="hidden md:block">Dashboard</span>
      </h2>
      <nav>
        <ul className="space-y-2">
          <SidebarListItem to="/dashboard/templates">
            <div className="flex gap-4 items-center ">
              <MdDescription />
              <p className="hidden md:block">Templates</p>
            </div>
          </SidebarListItem>
          <SidebarListItem to="/dashboard/assesments">
            <div className="flex gap-4 items-center ">
              <MdAssessment />
              <p className="hidden md:block">Assesments</p>
            </div>
          </SidebarListItem>
          <SidebarListItem to="/dashboard/users">
            <div className="flex gap-4 items-center ">
              <MdPeople />
              <p className="hidden md:block">Users </p>
            </div>
          </SidebarListItem>
          <SidebarListItem to="/dashboard/settings">
            <div className="flex gap-4 items-center ">
              <MdSettings />
              <p className="hidden md:block">Settings</p>
            </div>
          </SidebarListItem>
          <SidebarListItem to="/dashboard/help">
            <div className="flex gap-4 items-center ">
              <MdHelpOutline />
              <p className="hidden md:block">Help</p>
            </div>
          </SidebarListItem>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
