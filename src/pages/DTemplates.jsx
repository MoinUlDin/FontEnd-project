import React, { useState, useEffect } from "react";
import PrimaryListItem from "../components/childrens/PrimaryListItem";
import PrimaryListHeader from "../components/childrens/PrimaryListHeader";
import { useDispatch, useSelector } from "react-redux";
import TempService from "../services/tempService";
import FilterBy from "../components/childrens/FilterBy";
import CreateTemplateModal from "../components/CreateTemplateModel"; // Import the new modal
import CreateAssessmentModel from "../components/CreateAssessmentModel";
import Toast from "../components/childrens/FloatingMessage";
import { ImSpinner10 } from "react-icons/im";
import { FiTrash } from "react-icons/fi";

function DTemplates() {
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.templates.list);
  const user = useSelector((state) => state.auth.user); // Get current user info
  const [all, setAll] = useState(true);
  const [loading, setLoading] = useState(true);
  const inactiveClass = "border-b-1 border-gray-400 text-10";
  const activeClass = "border-b-2 border-blue-400 font-bold ";
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [toastbarColor, setToastbarColor] = useState(undefined);
  const [showToast, setShowToast] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
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

  // Filter templates by created_by_id when "My Templates" is selected.
  const templateNames = templates.map((template) => template.name);
  const filteredTemplates = (() => {
    // When filterQuery is present, filter templates by name
    if (filterQuery.trim().length >= 1) {
      return templates.filter((template) =>
        template.name.toLowerCase().includes(filterQuery.toLowerCase())
      );
    }
    // Fallback to previous filtering logic: either all or the user’s templates
    return all
      ? templates
      : templates.filter((template) => template.created_by_id === user.userId);
  })();

  if (loading) {
    return (
      <div className="flex text-[3rem] mt-10 md:mt-20 w-full h-full justify-center gap-5 items-center">
        <ImSpinner10 className="animate-spin" />
        <h1 className=" text-black font-bold ">Loading Templates . . .</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="text-2xl font-bold pb-6 border-b border-gray-200 flex justify-between ">
        <div className="hidden md:block">
          <FilterBy
            title="Search"
            list={templateNames}
            onSelect={(selected) => setFilterQuery(selected)}
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-[8px] hover:cursor-pointer bg-sunglow rounded-4xl px-4 p-1"
        >
          Create Template
        </button>
        <div className="text-10 min-w-[20%] px-2 flex justify-between mr-2">
          <div>
            <button
              className={`p-2 ${
                all ? "font-bold text-blue-800" : ""
              } hover:cursor-pointer hover:-translate-y-0.5 transition-all duration-300 `}
              onClick={() => setAll(true)}
            >
              All Templates
            </button>
            <div
              className={`w-full ${all ? activeClass : inactiveClass}`}
            ></div>
          </div>
          <div>
            <button
              className={`p-2 ${
                all ? "" : "font-bold text-blue-800"
              } hover:cursor-pointer hover:-translate-y-0.5 transition-all duration-300`}
              onClick={() => setAll(false)}
            >
              My Templates
            </button>
            <div
              className={`w-full ${all ? inactiveClass : activeClass}`}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-dash-lg mt-8 ">
        <PrimaryListHeader title="name" />
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((item) => (
            <PrimaryListItem
              key={item.id}
              id={item.id}
              title={item.name}
              createdat={item.created_at}
              createdby={item.created_by}
              onInvite={handleInvite}
              setShowToast={setShowToast}
              setToastbarColor={setToastbarColor}
              setApiResponse={setApiResponse}
            />
          ))
        ) : (
          <h1 className="text-center text-xl font-semibold mt-10">
            You haven't created a template yet.
          </h1>
        )}
        <div className="my-18 min-h-3"></div>
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
      {/* Show floating message */}
      {showToast && (
        <Toast
          onClose={() => {
            setShowToast(false);
            setToastbarColor(undefined);
          }}
          barColor={toastbarColor}
          message={apiResponse}
        />
      )}
    </div>
  );
}

export default DTemplates;
