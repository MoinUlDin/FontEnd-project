import React, { useState, useEffect } from "react";
import PrimaryListItem from "../components/childrens/PrimaryListItem";
import PrimaryListHeader from "../components/childrens/PrimaryListHeader";
import { useDispatch, useSelector } from "react-redux";
import TempService from "../services/tempService";
import FilterBy from "../components/childrens/FilterBy";
import CreateTemplateModal from "../components/CreateTemplateModel"; // Import the new modal
import CreateAssessmentModel from "../components/CreateAssessmentModel";
import Toast from "../components/childrens/FloatingMessage";

function DTemplates() {
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.templates.list);
  const [loading, setLoading] = useState(true);
  const inactiveClass = "border-b-1 border-gray-400 text-10";
  const activeClass = "border-b-2 border-blue-400 font-bold text-12";
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [apiResponse, setApiResponse] = useState("");

  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);

  const handleInvite = (templateId) => {
    setSelectedTemplateId(templateId);
    setShowAssessmentModal(true);
  };

  useEffect(() => {
    setLoading(true);
    TempService.fetchTemplates(dispatch)
      .catch((e) => console.log("Custom ", e))
      .finally(() => setLoading(false));
  }, [dispatch]);

  const handleModalSubmit = async (formData) => {
    try {
      await TempService.createTemplate(formData, dispatch);
      // Optionally refresh templates list after creating
      const res = await TempService.fetchTemplates(dispatch);
      setApiResponse(res?.message || "Template Created Successfully.");
      setShowToast(true);
      setShowModal(false);
    } catch (error) {
      setApiResponse(
        "Error creating template. Please try again." + error?.message
      );
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <h1 className="text-4xl text-black font-bold mt-5 md:mt-14">
          Loading Templates ...
        </h1>
      </div>
    );
  }

  console.log(templates);

  return (
    <div>
      <div className="text-2xl font-bold pb-6 border-b border-gray-200 flex justify-between ">
        <FilterBy />
        <button
          onClick={() => setShowModal(true)}
          className="text-[8px] hover:cursor-pointer bg-sunglow rounded-4xl px-4 p-1"
        >
          Create Template
        </button>
        <div className="text-10 min-w-[20%] px-2 flex justify-between mr-2">
          <div>
            <button
              className={`p-2 hover:cursor-pointer hover:-translate-y-0.5 transition-all duration-300 mb-1 `}
            >
              All Templates
            </button>
            <div className={`w-full ${activeClass}`}></div>
          </div>
          <div>
            <button
              className={`p-2 hover:cursor-pointer hover:-translate-y-0.5 transition-all duration-300 mb-1`}
            >
              My Templates
            </button>
            <div className={`w-full ${inactiveClass}`}></div>
          </div>
        </div>
      </div>
      <div className="max-w-dash-lg mt-8 ">
        <PrimaryListHeader title="name" />
        {templates.map((item) => (
          <PrimaryListItem
            key={item.id}
            id={item.id}
            title={item.name}
            createdat={item.created_at}
            createdby={item.created_by}
            onInvite={handleInvite}
          />
        ))}
      </div>

      {/* Render the modal popup when showModal is true */}
      {showModal && (
        <CreateTemplateModal
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {showAssessmentModal && (
        <CreateAssessmentModel
          onClose={() => {
            setShowAssessmentModal(false);
            setSelectedTemplateId(null);
          }}
          selectedTemplateId={selectedTemplateId}
        />
      )}
      {/* show floating messsage */}
      {showToast && <Toast message={apiResponse} />}
    </div>
  );
}

export default DTemplates;
