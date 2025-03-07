import FilterBy from "../components/childrens/FilterBy";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssessmentService from "../services/assessmentService";
import AssessmentListItem from "../components/childrens/AssessmentListItem";
import CreateAssessmentModel from "../components/CreateAssessmentModel";

function DAssesment() {
  const dispatch = useDispatch();
  const inactiveClass = "border-b-1 border-gray-400 text-10";
  const activeClass = "border-b-2 border-blue-400 font-bold text-12";

  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);

  const assessmentsObject = useSelector(
    (state) => state.assessment.assessments
  );
  const [loading, setLoading] = useState(true);

  const handleModalSubmit = async (formData) => {};

  useEffect(() => {
    AssessmentService.fetchAssessments(dispatch)
      .catch((error) => console.log("Error fetching assessments", error))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <div>Loading assessments...</div>;
  }

  // Convert normalized assessments object to array
  const assessments = Object.values(assessmentsObject);
  console.log(assessments);
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
      <header className="assessment_grid gap-6 font-semibold text-slate-800  bg-gray-300 py-2 md:py-3 px-1 md:px-2 mb-2 md:mb-3">
        <span>Name</span>
        <span>Email</span>
        <span>Template</span>
        <span>Status</span>
        <span>Start</span>
        <span>End</span>
        <span>FinalScore</span>
      </header>
      <div className="alter_bg gap-6">
        {assessments.map((assessment, index) => (
          <AssessmentListItem
            key={assessment.id || index}
            name={assessment.candidate.username}
            email={assessment.candidate.email}
            template={assessment.template}
            status={assessment.status}
            start={assessment.start_time}
            end={assessment.end_time}
            finalScore={assessment.final_score}
          />
        ))}
      </div>

      {/* Render the modal popup when showModal is true */}
      {showModal && (
        <CreateAssessmentModel onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default DAssesment;
