import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssessmentService from "../services/assessmentService";
import { ImSpinner10 } from "react-icons/im";
import Toast from "../components/childrens/FloatingMessage";
import { FiCopy, FiEye, FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import profile_img from "../assets/profile_img.png";
import { Tooltip } from "@mui/material";
import { FcViewDetails } from "react-icons/fc";
import FilterBy from "../components/childrens/FilterBy";
import CreateAssessmentModel from "../components/CreateAssessmentModel";
import WarningDialog from "../components/Forms/WarningDialog";
import { Link } from "react-router-dom";

dayjs.extend(duration);

export default function AssessmentPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const inactiveClass = "border-b-1 border-gray-400 text-10";
  const activeClass = "border-b-2 border-blue-400 font-bold text-12";

  // Get the assessments object from Redux and convert it to an array
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

  const calculateDuration = (start, end) => {
    if (start && end) {
      const diffMs = new Date(end) - new Date(start);
      return dayjs.duration(diffMs).format("HH:mm:ss");
    }
    return "-";
  };

  if (loading) {
    return (
      <div className="text-2xl flex gap-5">
        <ImSpinner10 className="animate-spin" />
        <span>Loading assessments...</span>
      </div>
    );
  }

  return (
    <div className="mx-2 md:mx-4 max-w-[95%] overflow-x-auto">
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
      {showToast && (
        <Toast message={apiResponse} onClose={() => setShowToast(false)} />
      )}
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
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-4 py-2 text-left">Candidate</th>
            <th className="px-4 py-2 text-left">Template</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Start</th>
            <th className="hidden md:block px-4 py-2 text-left ">Time Taken</th>
            <th className="px-4 py-2 text-left">Final Score</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((assessment) => (
            <tr key={assessment.id} className="mt-[90px]">
              {/* Candidate Cell */}
              <td className="px-4 py-2 truncate">
                <div className="flex items-center gap-2">
                  <img
                    src={profile_img}
                    alt="profile"
                    className="rounded-full h-8 w-8"
                  />
                  <div>
                    <p className="text-sm font-bold text-purple-700">
                      {assessment.candidate?.username || "-"}
                    </p>
                    <p className="truncate text-xs lg:flex items-center gap-1">
                      {assessment.candidate?.email || "-"}
                      <CopyEmail email={assessment.candidate?.email || "-"} />
                    </p>
                  </div>
                </div>
              </td>
              {/* Template Cell */}
              <td className="px-4 py-2">{assessment.template || "-"}</td>
              {/* Status Cell */}
              <td className="px-4 py-2">{assessment.status || "-"}</td>
              {/* Start Time Cell */}
              <td className="px-4 py-2">
                {assessment.start_time
                  ? dayjs(assessment.start_time).format("D-MMM-YY")
                  : "-"}
              </td>
              {/* Duration Cell */}
              <td className="px-4 py-2 hidden md:block">
                {assessment.start_time && assessment.end_time
                  ? calculateDuration(
                      assessment.start_time,
                      assessment.end_time
                    )
                  : "-"}
              </td>
              {/* Final Score Cell */}
              <td className="px-4 py-2">
                {assessment.final_score !== undefined
                  ? `${assessment.final_score}%`
                  : "-"}
              </td>
              {/* Actions Cell */}
              <td className="px-4 py-2 flex gap-3">
                <Tooltip title="View Detail" placement="top">
                  <Link
                    to={`/dashboard/assesments/detail/${assessment.id}`}
                    className="ptr hover:text-blue-500"
                  >
                    <FcViewDetails />
                  </Link>
                </Tooltip>
                <Tooltip title="Delete" placement="top">
                  <button onClick={() => handleDeleteClick(assessment.id)}>
                    <FiTrash2 className="text-red-600 ptr hover:text-red-800" />
                  </button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Separate component for the copy email icon with tooltip
function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="hidden md:block">
      <Tooltip title={copied ? "Copied" : "Copy Email"} placement="top">
        <span onClick={copy} className="cursor-pointer">
          <FiCopy size={14} className="text-green-800 hover:text-green-600" />
        </span>
      </Tooltip>
    </div>
  );
}
