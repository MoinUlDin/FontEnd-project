import React, { useState } from "react";
import InputField from "../components/childrens/InputField";
import AssessmentService from "../services/assessmentService";
import { useDispatch, useSelector } from "react-redux";

function CreateAssessmentModel({ onClose, onSubmit }) {
  const bgColor = "bg-white";
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    candidate_email: "",
    difficulty_level: "Easy", // default value
    allocated_time: "",
    negative_marking: false,
    template_id: "",
    description: "", // optional field if needed
  });

  // Get templates from the Redux store
  const templates = useSelector((state) => state.templates.list);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.candidate_email.trim()) {
      setErrorMessage("Candidate email is required");
      return;
    }
    if (!formData.template_id) {
      setErrorMessage("Please select a template");
      return;
    }
    if (!formData.allocated_time.trim()) {
      setErrorMessage("Allocated time is required");
      return;
    }
    setErrorMessage("");

    try {
      // Call the createAssessment service method
      await AssessmentService.createAssessment(formData, dispatch);
      // On success, you may refresh the assessments list or close the modal
      onClose();
    } catch (error) {
      console.error("Error creating assessment:", error);
      let errMsg = "";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errMsg = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(" ")
          : error.response.data.message;
      } else {
        errMsg =
          error.message || "Error creating assessment. Please try again.";
      }
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl overflow-hidden min-h-90 z-10 min-w-[800px]">
        <div className="text-xl flex px-3 md:px-5 justify-between font-bold bg-black py-4 text-white">
          <h2>Create Assessment</h2>
          <span onClick={onClose} className="hover:cursor-pointer p-1">
            ❌
          </span>
        </div>
        <form
          className="grid grid-cols-9 min-h-[320px]"
          onSubmit={handleFormSubmit}
        >
          <div className="h-full col-span-3 bg-orange-300 ">leftSide Imge</div>
          <div className="col-span-6 flex justify-center px-4">
            <div className="flex flex-col mr-10 mt-6">
              {/* Candidate Email */}
              <div className="mt-5 w-full">
                <InputField
                  ctype="text"
                  id="candidateEmail"
                  clable="Candidate Email"
                  css1={bgColor}
                  name="candidate_email"
                  value={formData.candidate_email}
                  onChange={handleChange}
                />
                {/* Error Message */}
                {errorMessage && (
                  <p className="text-red-500 text-xs -mt-2">{errorMessage}</p>
                )}
              </div>
              {/* Allocated Time */}
              <div className="mt-5 w-full">
                <InputField
                  ctype="number"
                  id="allocatedTime"
                  clable="Allocated Time (minutes)"
                  css1={bgColor}
                  name="allocated_time"
                  value={formData.allocated_time}
                  onChange={handleChange}
                />
              </div>
              {/* Negative Marking Checkbox */}
              <div className="mt-5 w-full flex items-center">
                <input
                  type="checkbox"
                  id="negativeMarking"
                  name="negative_marking"
                  checked={formData.negative_marking}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label
                  htmlFor="negativeMarking"
                  className="text-sm font-semibold"
                >
                  Negative Marking
                </label>
              </div>
            </div>
            <div className="flex flex-col">
              {/* Difficulty Level Dropdown */}
              <div className="mt-5 w-full">
                <label className="block text-sm font-semibold mb-1">
                  Difficulty Level
                </label>
                <select
                  name="difficulty_level"
                  value={formData.difficulty_level}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Include">Include</option>
                </select>
              </div>

              {/* Template Dropdown */}
              <div className="mt-5 w-full">
                <label className="block text-sm font-semibold mb-1">
                  Template
                </label>
                <select
                  name="template_id"
                  value={formData.template_id}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select Template</option>
                  {templates.map((temp) => (
                    <option key={temp.id} value={temp.id}>
                      {temp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Save Button */}
              <div className="flex justify-center items-end mt-8">
                <button
                  type="submit"
                  className="bg-sunglow mb-4 font-semibold hover:text-black hover:cursor-pointer text-white px-4 py-2 rounded-lg mr-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAssessmentModel;
