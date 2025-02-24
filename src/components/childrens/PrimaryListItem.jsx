import React from "react";
import EmailIcon from "./EmailI";
import EmailI from "./EmailI";

function PrimaryListItem({
  id,
  title,
  createdat,
  createdby,
  ispredefined = false,
}) {
  return (
    <div className="md:max-w-dash-lg max-w-dash ">
      <div
        key={id}
        className="grid grid-cols-5 gap-4 items-center bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition"
      >
        {/* Name and Actions */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="text-purple-600 font-semibold text-dash-it hover:underline"
            >
              {title}
            </a>
          </div>
          <div className="flex gap-3 text-sm text-gray-500 mt-2 md:mt-3">
            <a href="#" className="hover:text-purple-600 text-dash-i">
              <EmailI></EmailI> Invite
            </a>
            <a href="#" className="hover:text-purple-600 text-dash-i">
              👁️ Preview
            </a>
            <a href="#" className="hover:text-purple-600 text-dash-i">
              ⚙️ Settings
            </a>
          </div>
        </div>

        {/* Stats */}
        <div>{createdat}</div>
        <div>{createdby}</div>
      </div>
    </div>
  );
}

export default PrimaryListItem;
