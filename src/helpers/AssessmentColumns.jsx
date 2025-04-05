// assessmentColumns.js
import React from "react";
import { Tooltip } from "@mui/material";
import { FiCopy } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FcViewDetails } from "react-icons/fc";
import { normalizeDateString } from "./HelperFunctions";

import dayjs from "dayjs";
import {
  AdminPanelSettings,
  DeleteForever,
  PersonAdd,
  PersonOff,
} from "@mui/icons-material";
import profile_img from "../assets/profile_img.png";

const formatDuration = (start, end) => {
  if (!start || !end) return "-";
  const diffMs = new Date(end) - new Date(start);
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};
// Component for copying email (can be imported from your existing file if needed)
function CopyEmail({ email }) {
  return (
    <Tooltip title="Copy Email" placement="top">
      <span className="cursor-pointer">
        <FiCopy size={14} className="text-green-800 hover:text-green-600" />
      </span>
    </Tooltip>
  );
}

export const AssessmentColumns = [
  {
    field: "candidate",
    headerName: "Candidate",
    width: 200,
    sortable: true,
    valueGetter: (params) => {
      const candidate = params || {};
      return `${candidate.username || ""} ${candidate.email || ""}`.trim();
    },
    renderCell: (params) => {
      const row = params?.row;
      return (
        <div className="flex items-center gap-2">
          <img
            src={profile_img}
            alt="profile"
            className="rounded-full h-8 w-8"
          />
          <div>
            <div className="text-xs flex items-center gap-1">
              {row?.candidate?.username || "-"}
              <CopyEmail email={row?.candidate?.email || "-"} />
            </div>
            <div className="text-sm font-bold text-purple-700">
              {row?.candidate?.email || "-"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    field: "job_role",
    headerName: "Job Role",
    width: 120,
    sortable: true,
    renderCell: (params) => params.value || "-",
  },
  {
    field: "template",
    headerName: "Template",
    width: 140,
    sortable: true,
    renderCell: (params) => params.value || "-",
  },
  {
    field: "status",
    headerName: "Status",
    width: 114,
    sortable: true,
  },
  {
    field: "start_time",
    headerName: "Started",
    width: 120,
    sortable: true,
    renderCell: (params) => {
      const row = params?.row;
      const dateStr = row?.start_time;
      if (!dateStr) return "-";
      const normalized = normalizeDateString(dateStr);
      const formatted = dayjs(normalized).format("D-MMM-YY");
      let duration = "-";
      if (row.start_time && row.end_time) {
        const start = normalizeDateString(row.start_time);
        const end = normalizeDateString(row.end_time);
        duration = formatDuration(start, end);
      }
      return (
        <div className="flex flex-col items-center">
          <div>{formatted}</div>
          <span>{duration}</span>
        </div>
      );
    },
  },
  {
    field: "final_score",
    headerName: "Final Score",
    width: 148,
    sortable: true,
    renderCell: (params) => {
      const score = params.value;
      return score !== undefined && score !== null ? `${score}%` : "-";
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 170,
    sortable: false,
    renderCell: (params) => {
      const row = params?.row;
      return (
        <div className="mr-3 flex gap-2 items-center text-lg">
          <Tooltip title="View Detail" placement="top">
            <Link
              to={`/dashboard/assesments/detail/${row?.id}`}
              className="hover:text-blue-500"
            >
              <FcViewDetails />
            </Link>
          </Tooltip>
          <Tooltip title="Hire" placement="top">
            <button onClick={() => handleHire(row?.id)}>
              <div className="ptr">
                <AdminPanelSettings fontSize="small" color="success" />
              </div>
            </button>
          </Tooltip>
          <Tooltip title="Shortlist" placement="top">
            <button onClick={() => handleShortlist(row?.id)}>
              <div className="ptr">
                <PersonAdd fontSize="small" color="primary" />
              </div>
            </button>
          </Tooltip>
          <Tooltip title="Reject" placement="top">
            <button onClick={() => handleReject(row?.id)}>
              <div className="ptr">
                <PersonOff fontSize="small" color="primary" />
              </div>
            </button>
          </Tooltip>
          <Tooltip title="Delete" placement="top">
            <button onClick={() => handleDeleteClick(row?.id)}>
              <div className="ptr">
                <DeleteForever fontSize="small" color="error" />
              </div>
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];
