import FilterBy from "../components/childrens/FilterBy";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssessmentService from "../services/assessmentService";
import AssessmentListItem from "../components/childrens/AssessmentListItem";
import CreateAssessmentModel from "../components/CreateAssessmentModel";
import WarningDialog from "../components/Forms/WarningDialog";
import { ImSpinner10 } from "react-icons/im";
import Toast from "../components/childrens/FloatingMessage";

function DAssesment() {
  const dispatch = useDispatch();
  const inactiveClass = "border-b-1 border-gray-400 text-10";
  const activeClass = "border-b-2 border-blue-400 font-bold text-12";

  // Modal visibility states
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const assessmentsObject = useSelector(
    (state) => state.assessment.assessments
  );
  const [loading, setLoading] = useState(true);
  const assessments = Object.values(assessmentsObject);

  useEffect(() => {
    AssessmentService.fetchAssessments(dispatch)
      .catch((error) => console.log("Error fetching assessments", error))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-2xl flex gap-5">
        <ImSpinner10 className="animate-spin" />
        <span>Loading assessments...</span>
      </div>
    );
  }

  // When user clicks the delete button, store the id and show warning dialog.
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowWarning(true);
  };

  // When the warning dialog confirms deletion.
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

  // When the user cancels deletion.
  const handleCancelDelete = () => {
    setShowWarning(false);
    setDeleteId(null);
  };

  return (
    <div className="mx-2 md:mx-4 max-w-[95%]">
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
              className={`p-2 hover:cursor-pointer hover:-translate-y-0.5 transition-all duration-300 mb-1 `}
            >
              All Assessments
            </button>
            <div className={`w-full ${activeClass}`}></div>
          </div>
          <div>
            <button
              className={`p-2 hover:cursor-pointer hover:-translate-y-0.5 transition-all duration-300 mb-1`}
            >
              My Assessments
            </button>
            <div className={`w-full ${inactiveClass}`}></div>
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="h-svh overflow-scroll">
        <header className="grid grid-cols-11 sticky top-0 font-semibold text-slate-800 bg-gray-300 py-2 md:py-3 px-1 md:px-2 mb-2 md:mb-3">
          <p className="col-span-2 ml-5">Candidate</p>
          <p className="col-span-2">Template</p>
          <p className="col-span-1">Status</p>
          <p className="col-span-1">Start</p>
          <p className="col-span-2">Time Taken</p>
          <p className="col-span-1">FinalScore</p>
        </header>
        <div className="alter_bg gap-6">
          {assessments.map((assessment) => (
            <AssessmentListItem
              key={assessment.id}
              id={assessment.id}
              name={assessment.candidate.username}
              email={assessment.candidate.email}
              template={assessment.template}
              status={assessment.status}
              start={assessment.start_time}
              end={assessment.end_time}
              finalScore={assessment.final_score}
              onDelete={() => handleDeleteClick(assessment.id)}
            />
          ))}
        </div>
      </div>
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
      {/* Floating Message */}
      {showToast && (
        <Toast message={apiResponse} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default DAssesment;
