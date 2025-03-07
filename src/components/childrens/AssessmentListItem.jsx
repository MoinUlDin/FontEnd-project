import React from "react";
import dayjs from "dayjs";

function AssessmentListItem({
  key,
  email,
  name,
  template,
  status,
  start,
  end,
  finalScore,
  css = "",
  fn,
}) {
  let stime = start;
  let etime = end;
  if (start) stime = dayjs(start).format("D-MMM-YY");
  else stime = "-";
  if (etime) etime = dayjs(etime).format("D-MMM-YY");
  else etime = "-";
  return (
    <div key={key} className={`css  mt-templist md:mt-templist-md`}>
      <div
        className={`assessment_grid text-12 bg-white shadow-md rounded-lg p-4 hover:shadow-lg hover:shadow-gray-400 hover:scale-x-101 hover:cursor-pointer transition-all duration-100`}
      >
        <span>{name ? name : "-"} </span>
        <span>{email ? email : "-"} </span>
        <span>{template ? template : "-"} </span>
        <span>{status ? status : "-"} </span>
        <span>{stime} </span>
        <span>{etime} </span>
        <span>{finalScore != null ? `${finalScore}%` : "-"}</span>
      </div>
    </div>
  );
}

export default AssessmentListItem;
