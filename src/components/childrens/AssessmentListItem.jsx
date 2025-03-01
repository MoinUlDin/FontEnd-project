import React from "react";
import dayjs from "dayjs";

function AssessmentListItem({
  email,
  name,
  template,
  status,
  start,
  end,
  finalScore,
  css = "",
}) {
  console.log("final", finalScore);
  let stime = start;
  let etime = end;
  if (start) stime = dayjs(start).format("D-MMM-YY");
  else stime = "-";
  if (etime) etime = dayjs(etime).format("D-MMM-YY");
  else etime = "-";
  return (
    <div className={`css text-10 px-2 bg-white hover:cursor-pointer`}>
      <div className={`assessment_grid text-10 py-4`}>
        <span>{name ? name : "-"} </span>
        <span>{email ? email : "-"} </span>
        <span>{template ? template : "-"} </span>
        <span>{status ? status : "-"} </span>
        <span>{stime} </span>
        <span>{etime} </span>
        <span>{finalScore ? finalScore : "-"} </span>
      </div>
    </div>
  );
}

export default AssessmentListItem;
