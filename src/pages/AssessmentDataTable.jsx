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
import FilterBy from "../components/childrens/FilterBy";
import CreateAssessmentModel from "../components/CreateAssessmentModel";
import WarningDialog from "../components/Forms/WarningDialog";
import { Link } from "react-router-dom";
import { FcViewDetails } from "react-icons/fc";

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
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const inactiveClass = "border-b-1 border-gray-400 text-10";
  const activeClass = "border-b-2 border-blue-400 font-bold text-12";

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
    setShowWarning(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setLoading(true);
      AssessmentService.deleteAssessment(deleteId, dispatch)
        .then((res) => {
          dispatch({
            type: "assessment/deleteAssessment",
            payload: { id: deleteId },
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

  const handleCancelDelete = () => {
    setShowWarning(false);
    setDeleteId(null);
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
        <div className="flex gap-3">
          <Tooltip title="View Detail" placement="top">
            <Link
              to={`/dashboard/assesments/detail/${row.id}`}
              className="ptr hover:text-blue-500"
            >
              <FcViewDetails />
            </Link>
          </Tooltip>
          <button onClick={() => handleDeleteClick(row.id)}>
            <FiTrash2 className="text-red-500 ptr hover:text-red-700" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: "100px",
    },
  ];

  if (loading) {
    return (
      <div className="text-xl md:text-[3rem] mt-10 md:mt-20 font-bold flex gap-5 items-center justify-center ">
        <ImSpinner10 className="animate-spin" />
        <span>Loading assessments...</span>
      </div>
    );
  }

  return (
    <div className="mx-2 md:mx-4 max-w-[95%]">
      {showToast && (
        <Toast message={apiResponse} onClose={() => setShowToast(false)} />
      )}
      {/* Create Assessment Modal */}
      {showModal && (
        <CreateAssessmentModel onClose={() => setShowModal(false)} />
      )}
      {/* Warning Dialog for Deletion */}
      {showWarning && (
        <WarningDialog
          message="Are you sure you want to delete this assessment? This action is permanent."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* header search fields and create button */}
      <div className="text-2xl font-bold pb-6 border-b border-gray-200 flex justify-between ">
        <FilterBy />
        <button
          onClick={() => setShowModal(true)}
          className="text-[8px] flex justify-center items-center hover:cursor-pointer bg-sunglow rounded-4xl px-4"
        >
          Create Assessment
        </button>
        <div className="text-10 px-2 flex gap-2 justify-between">
          <div>
            <button
              className={`p-2 hover:cursor-pointer hover:-translate-y-0.5 transition-all duration-300 `}
            >
              All Assessments
            </button>
            <div className={`w-full ${activeClass}`}></div>
          </div>
          <div>
            <button
              className={`p-2 hover:cursor-pointer hover:-translate-y-0.5 transition-all duration-300`}
            >
              My Assessments
            </button>
            <div className={`w-full ${inactiveClass}`}></div>
          </div>
        </div>
      </div>

      {/* Outer container that allows horizontal scroll for the table */}
      <div className="w-full overflow-x-auto">
        {/* Set a min-width matching the total width of your columns */}
        <div className="w-full md:min-w-[1010px]">
          <DataTable
            className="w-full md:min-w-[1000px]"
            columns={columns}
            data={assessments}
            pagination
            responsive
            highlightOnHover
          />
        </div>
      </div>
    </div>
  );
}
