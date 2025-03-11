import React from "react";

function PrimaryListHeader({
  title = "Name",
  createdat = "Date",
  createdby = "Created By",
  css = "",
}) {
  return (
    <div
      className={`${css} grid grid-cols-5 font-semibold text-10 m-1.5 uppercase`}
    >
      <div className="col-span-3">{title}</div>
      <div className="hidden md:block place-self-center">{createdat}</div>
      <div className="place-self-center flex gap-1">
        <span className="hidden md:inline-block">Created </span> <span>By</span>
      </div>
    </div>
  );
}

export default PrimaryListHeader;
