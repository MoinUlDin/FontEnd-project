import React, { useState } from "react";
import dayjs from "dayjs";
import profile_img from "../../assets/profile_img.png";
import { FiCopy, FiTrash2 } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
function AssessmentListItem({
  id,
  email,
  name,
  template,
  status,
  start,
  end,
  finalScore,
  css = "",
  onDelete,
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  let stime = start;
  let etime = end;
  let formattedDuration = null;
  if (start) stime = dayjs(start).format("D-MMM-YY");
  else stime = "-";
  if (etime) etime = dayjs(etime).format("D-MMM-YY");
  else etime = "-";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  if (start && end) {
    const startTime = dayjs(start); // Convert to Day.js object
    const endTime = dayjs(end); // Convert to Day.js object

    const diffMs = endTime.diff(startTime);
    formattedDuration = dayjs.duration(diffMs).format("HH:mm:ss");
  }

  return (
    <div key={id} className={`css  mt-templist md:mt-templist-md ${css}`}>
      <div
        className={`assessment_grid text-12 bg-white shadow-md rounded-lg p-4 hover:shadow-lg hover:shadow-gray-400 hover:scale-x-101 hover:cursor-pointer transition-all duration-100`}
      >
        <Link
          to={`/dashboard/assesments/detail/${id}`}
          className="col-span-9 grid grid-cols-9 items-center"
        >
          <div className="col-span-2 flex gap-2  ">
            <img
              src={profile_img}
              className="rounded-full max-h-8 max-w-8"
              alt="profile"
            />
            <div>
              <p className="text-12 font-bold text-purple-700 capitalize">
                {name ? name : "-"}{" "}
              </p>
              <p className="flex gap-2 text-10">
                {email ? email : "-"}{" "}
                <Tooltip
                  title={copied ? "Coppied" : "Copy Email"}
                  placement="top"
                >
                  <span>
                    <FiCopy
                      size={14}
                      className="cursor-pointer text-green-800 hover:text-green-600"
                      onClick={copyToClipboard}
                    />
                  </span>
                </Tooltip>
              </p>
            </div>
          </div>
          <p className="col-span-2 ">{template ? template : "-"} </p>
          <p>{status ? status : "-"} </p>
          <p>{stime} </p>
          <p className="col-span-2">
            {formattedDuration ? formattedDuration : etime}{" "}
          </p>
          <p>{finalScore != null ? `${finalScore}%` : "-"}</p>
        </Link>

        {/* Controls */}
        <div
          onClick={onDelete ? () => onDelete(id) : undefined}
          className="place-self-center text-sm hover:text-red-700"
        >
          <FiTrash2 />
        </div>
      </div>
    </div>
  );
}

export default AssessmentListItem;
