import React from "react";

function PrimaryListHeader({
  title = "name",
  createdat = "date",
  createdby = "user",
  css = "",
}) {
  return (
    <div
      className={`${css} grid grid-cols-5 font-semibold text-dash-header m-1.5 uppercase`}
    >
      <div className="col-span-3">{title}</div>
      <div className="place-self-center">{createdat}</div>
      <div className="place-self-center">{createdby}</div>
    </div>
  );
}

export default PrimaryListHeader;
