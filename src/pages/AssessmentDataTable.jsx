// src/components/AssessmentDataTable.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssessmentService from "../services/assessmentService";
import { ImSpinner10 } from "react-icons/im";
import Toast from "../components/childrens/FloatingMessage";
import { FiCopy, FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import profile_img from "../assets/profile_img.png";
import { Tooltip } from "@mui/material";
import DataTable from "react-data-table-component";

// Helper: format duration between start and end times
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

// Component for copying email with tooltip.
function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Tooltip title={copied ? "Copied" : "Copy Email"} placement="top">
      <span onClick={copy} className="cursor-pointer">
        <FiCopy size={14} className="text-green-800 hover:text-green-600" />
      </span>
    </Tooltip>
  );
}

export default function AssessmentDataTable() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Retrieve assessments from Redux store (assumed to be an object keyed by ID)
  const assessmentsObject = useSelector(
    (state) => state.assessment.assessments
  );
  const assessments = Object.values(assessmentsObject);

  useEffect(() => {
    AssessmentService.fetchAssessments(dispatch)
      .catch((error) => console.log("Error fetching assessments", error))
      .finally(() => setLoading(false));
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    if (id) {
      setLoading(true);
      AssessmentService.deleteAssessment(id, dispatch)
        .then((res) => {
          dispatch({
            type: "assessment/deleteAssessment",
            payload: { id },
          });
          setShowToast(true);
          setApiResponse(res ? res.message : "Assessment Deleted Successfully");
        })
        .catch((error) => {
          setShowToast(true);
          setApiResponse(error ? error.message : "Error deleting assessment");
        })
        .finally(() => {
          setLoading(false);
          setDeleteId(null);
        });
    }
  };

  const columns = [
    {
      name: "Candidate",
      selector: (row) => row.candidate?.username || "-",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <img
            src={profile_img}
            alt="profile"
            className="rounded-full h-8 w-8"
          />
          <div>
            <div className="text-sm font-bold text-purple-700">
              {row.candidate?.username || "-"}
            </div>
            <div className="text-xs flex items-center gap-1">
              {row.candidate?.email || "-"}{" "}
              <CopyEmail email={row.candidate?.email || "-"} />
            </div>
          </div>
        </div>
      ),
      sortable: true,
      width: "250px",
    },
    {
      name: "Template",
      selector: (row) => row.template || "-",
      sortable: true,
      width: "150px",
    },
    {
      name: "Status",
      selector: (row) => row.status || "-",
      sortable: true,
      width: "120px",
    },
    {
      name: "Start",
      selector: (row) =>
        row.start_time ? dayjs(row.start_time).format("D-MMM-YY") : "-",
      sortable: true,
      width: "120px",
    },
    {
      name: "Time Taken",
      selector: (row) =>
        row.start_time && row.end_time
          ? formatDuration(row.start_time, row.end_time)
          : "-",
      sortable: false,
      width: "150px",
    },
    {
      name: "Final Score",
      selector: (row) =>
        row.final_score !== undefined && row.final_score !== null
          ? `${row.final_score}%`
          : "-",
      sortable: true,
      width: "120px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <button onClick={() => handleDeleteClick(row.id)}>
          <FiTrash2 className="text-red-600 hover:text-red-800" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  if (loading) {
    return (
      <div className="text-2xl flex gap-5">
        <ImSpinner10 className="animate-spin" />
        <span>Loading assessments...</span>
      </div>
    );
  }

  return (
    <div className="mx-2 md:mx-4 max-w-[95%] overflow-x-hidden">
      {showToast && (
        <Toast message={apiResponse} onClose={() => setShowToast(false)} />
      )}
      {/* Outer container that allows horizontal scroll for the table */}
      <div className="w-full overflow-x-auto">
        {/* Set a min-width matching the total width of your columns */}
        <div className="min-w-[1010px]">
          <DataTable
            columns={columns}
            data={assessments}
            pagination
            responsive
            highlightOnHover
            fixedHeader
            fixedHeaderScrollHeight="400px"
          />
        </div>
      </div>
    </div>
  );
}
