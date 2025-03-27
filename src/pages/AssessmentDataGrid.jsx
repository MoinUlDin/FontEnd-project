import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssessmentService from "../services/assessmentService";
import { ImSpinner10 } from "react-icons/im";
import Toast from "../components/childrens/FloatingMessage";
import { FiCopy, FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import profile_img from "../assets/profile_img.png";
import { Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FilterBy from "../components/childrens/FilterBy";
import CreateAssessmentModel from "../components/CreateAssessmentModel";
import WarningDialog from "../components/Forms/WarningDialog";
import { Link } from "react-router-dom";
import { FcViewDetails } from "react-icons/fc";
import {
  AdminPanelSettings,
  DeleteForever,
  PersonAdd,
  PersonOff,
} from "@mui/icons-material";

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

// Helper: Normalize ISO date string to milliseconds precision
const normalizeDateString = (dateStr) => {
  if (!dateStr) return null;
  const match = dateStr.match(/^(.*\.\d{3})\d*(Z)$/);
  return match ? match[1] + match[2] : dateStr;
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

export default function AssessmentDataGrid() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [itemsSelected, setItemsSelected] = useState(false);
  // Active tab: 1 = All, 2 = Uncategorized, 3 = Shortlisted, 4 = Hired, 5 = Rejected
  const [activeTab, setActiveTab] = useState(1);

  const inactiveClass = "border-b border-gray-400 text-10";
  const activeTabcss = "bg-blue-800 text-white px-2 md:px-4 lg:px-6";

  // Retrieve assessments from Redux store (assumed to be an object keyed by ID)
  const assessmentsObject = useSelector(
    (state) => state.assessment.assessments
  );
  const assessments = Object.values(assessmentsObject)
    .filter((item) => item)
    .map((item) => ({
      id: item.id || item._id,
      ...item,
    }));

  // actions click handlers
  const handleUpdateStatus = (id, newStatus) => {
    setLoading(true);
    AssessmentService.updateAssessmentStatus(id, newStatus, dispatch)
      .then((res) => {
        setShowToast(true);
        setApiResponse(res?.message || `Candidate ${newStatus} successfully.`);
      })
      .catch((error) => {
        setShowToast(true);
        setApiResponse(error?.message || `Failed to update status.`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleHire = (id) => handleUpdateStatus(id, "Hired");
  const handleShortlist = (id) => handleUpdateStatus(id, "Shortlisted");
  const handleReject = (id) => handleUpdateStatus(id, "Rejected");

  // Filter assessments based on activeTab and candidate_status.
  const filteredAssessments = assessments.filter((assessment) => {
    if (activeTab === 1) return true; // All
    if (activeTab === 2) return assessment.candidate_status === "Uncategorized";
    if (activeTab === 3) return assessment.candidate_status === "Shortlisted";
    if (activeTab === 4) return assessment.candidate_status === "Hired";
    if (activeTab === 5) return assessment.candidate_status === "Rejected";
    return true;
  });

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

  // Define DataGrid columns
  const columns = [
    {
      field: "candidate",
      headerName: "Candidate",
      width: 250,
      sortable: true,
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
              <div className="text-sm font-bold text-purple-700">
                {row?.candidate?.username || "-"}
              </div>
              <div className="text-xs flex items-center gap-1">
                {row?.candidate?.email || "-"}
                <CopyEmail email={row?.candidate?.email || "-"} />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: "template",
      headerName: "Template",
      width: 140,
      sortable: true,
      renderCell: (params) => {
        const template = params.value;
        return template || "-";
      },
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

  if (loading) {
    return (
      <div className="text-xl md:text-[3rem] mt-10 md:mt-20 font-bold flex gap-5 items-center justify-center">
        <ImSpinner10 className="animate-spin" />
        <span>Loading assessments...</span>
      </div>
    );
  }

  return (
    <div className="mx-2 md:mx-4 px-2 sm:w-[calc(76svw-0px)] md:w-[calc(72svw-0px)] lg:w-[calc(76svw-0px)]">
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
      {/* Header section with FilterBy and Tabs */}
      <div className="text-2xl font-bold pb-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="hidden md:block">
          <FilterBy />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-[8px] flex justify-center items-center hover:cursor-pointer bg-sunglow rounded-4xl px-5 py-4"
        >
          Create Assessment
        </button>
      </div>
      <div className="bg-white my-2 p-2 ">
        <ul className="flex text-[8px] md:text-[10px] py-3 lg:text-sm justify-between items-center w-full md:max-w-[70svw]">
          <li
            onClick={() => setActiveTab(1)}
            className={`p-2 ptr rounded-lg flex gap-1 md:gap-2 items-center ${
              activeTab === 1 ? activeTabcss : ""
            }`}
          >
            All{" "}
            <span className="rounded-full bg-gray-300 px-2">
              {assessments.length}
            </span>
          </li>
          <li
            onClick={() => setActiveTab(2)}
            className={`p-2 ptr rounded-lg flex gap-1 md:gap-2 items-center ${
              activeTab === 2 ? activeTabcss : ""
            }`}
          >
            Uncategorized{" "}
            <span className="rounded-full bg-gray-300 px-2">
              {
                assessments.filter(
                  (ass) => ass.candidate_status === "Uncategorized"
                ).length
              }
            </span>
          </li>
          <li
            onClick={() => setActiveTab(3)}
            className={`p-2 ptr rounded-lg flex gap-1 md:gap-2 items-center ${
              activeTab === 3 ? activeTabcss : ""
            }`}
          >
            Shortlisted{" "}
            <span className="rounded-full bg-gray-300 px-2">
              {
                assessments.filter(
                  (ass) => ass.candidate_status === "Shortlisted"
                ).length
              }
            </span>
          </li>
          <li
            onClick={() => setActiveTab(4)}
            className={`p-2 ptr rounded-lg flex gap-1 md:gap-2 items-center ${
              activeTab === 4 ? activeTabcss : ""
            }`}
          >
            Hired{" "}
            <span className="rounded-full bg-gray-300 px-2">
              {
                assessments.filter((ass) => ass.candidate_status === "Hired")
                  .length
              }
            </span>
          </li>
          <li
            onClick={() => setActiveTab(5)}
            className={`p-2 ptr rounded-lg flex gap-1 md:gap-2 items-center ${
              activeTab === 5 ? activeTabcss : ""
            }`}
          >
            Rejected{" "}
            <span className="rounded-full bg-gray-300 px-2">
              {
                assessments.filter((ass) => ass.candidate_status === "Rejected")
                  .length
              }
            </span>
          </li>
        </ul>
        {/* only show this when user selects some item in from list  */}
        <div
          className={`${
            itemsSelected ? "flex" : "hidden"
          } mr-3  gap-3 items-center text-lg m-2`}
        >
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
      </div>

      <div className="flex flex-col h-[500px] w-full">
        <DataGrid
          rows={
            activeTab === 1
              ? assessments
              : assessments.filter((assessment) => {
                  if (activeTab === 2)
                    return assessment.candidate_status === "Uncategorized";
                  if (activeTab === 3)
                    return assessment.candidate_status === "Shortlisted";
                  if (activeTab === 4)
                    return assessment.candidate_status === "Hired";
                  if (activeTab === 5)
                    return assessment.candidate_status === "Rejected";
                  return true;
                })
          }
          columns={columns}
          disableSelectionOnClick
          checkboxSelection
          rowHeight={70}
          headerHeight={60}
          sx={{
            border: "none",
            ".MuiDataGrid-cell": {
              borderBottom: "1px solid #e0f0e0",
              whiteSpace: "normal",
              lineHeight: "1.9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#F1857C",
              fontSize: "1rem",
              color: "#0d0f54",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "600",
            },
          }}
        />
      </div>
    </div>
  );
}
