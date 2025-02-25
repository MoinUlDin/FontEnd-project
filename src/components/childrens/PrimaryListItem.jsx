import React from "react";
import EmailIcon from "./EmailI";
import EmailI from "./EmailI";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function PrimaryListItem({
  id,
  title,
  createdat,
  createdby,
  ispredefined = false,
}) {
  const fDate = dayjs(createdat).format("D-MMM-YYYY");
  return (
    <div
      key={id}
      className="md:max-w-dash-lg max-w-dash mt-templist md:mt-templist-md"
    >
      <div className="grid grid-cols-5 gap-4 items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg hover:shadow-gray-400  hover:scale-x-101   hover:cursor-pointer transition-all duration-100">
        {/* Name and Actions */}
        <div className="col-span-3">
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="text-purple-600 font-semibold text-dash-it hover:underline"
            >
              {title}
            </a>
          </div>
          <div className="flex gap-3 text-sm text-gray-500 mt-2 md:mt-3">
            <Link to="" className="hover:text-purple-600 text-dash-i">
              <EmailI></EmailI> Invite
            </Link>
            <Link
              to={`/dashboard/template/${id}`}
              className="hover:text-purple-600 text-dash-i"
            >
              👁️ Preview
            </Link>
            <Link to="#" className="hover:text-purple-600 text-dash-i">
              ⚙️ Settings
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="place-self-center text-dash-it">{fDate}</div>
        <div className="place-self-center text-dash-it">{createdby}</div>
      </div>
    </div>
  );
}

export default PrimaryListItem;
