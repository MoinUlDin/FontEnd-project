import React from "react";

function AssessmentListItem({
  email = "-",
  name = "-",
  template = "-",
  status = "-",
  start = "-",
  end = "-",
  finalScore = "-",
  css = "",
}) {
  return (
    <div className={`css text-10 px-2 bg-white hover:cursor-pointer`}>
      <div className={`assessment_grid text-10 py-4`}>
        <span>{name} </span>
        <span>{email} </span>
        <span>{template} </span>
        <span>{status} </span>
        <span>{start} </span>
        <span>{end} </span>
        <span>{finalScore} </span>
      </div>
    </div>
  );
}

export default AssessmentListItem;
