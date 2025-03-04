import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/childrens/InputField";
import AssessmentService from "../services/assessmentService";
import { useDispatch, useSelector } from "react-redux";
import { ImSpinner8 } from "react-icons/im"; //
import sideimg from "../assets/report.avif";
import { FiX } from "react-icons/fi";
function CreateAssessmentModel({ onClose, selectedTemplateId }) {
  const bgColor = "bg-white";
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const templates = useSelector((state) => state.templates.list);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      candidate_email: "",
      difficulty_level: "Easy",
      allocated_time: "",
      negative_marking: false,
      template_id: selectedTemplateId || "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    setApiError("");
    clearErrors();
    setIsSaving(true);
    try {
      await AssessmentService.createAssessment(data, dispatch);
      onClose();
    } catch (error) {
      console.error("Error creating assessment:", error);
      let errMsg = error.response?.data?.message;
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.join(" ");
      } else if (!errMsg) {
        // Check for other common error message keys
        errMsg =
          error.response?.data?.detail ||
          error.response?.data?.non_field_errors?.join(" ");
      }
      setApiError(errMsg || "Error creating assessment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 drop-shadow-2xl shadow-black">
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl overflow-hidden min-h-90 z-10 min-w-[800px] border-2 border-amber-700">
        {/* Header */}
        <div className="text-xl flex px-3 md:px-5 justify-between font-bold bg-black py-4 text-white">
          <h2>Create Assessment</h2>
          <div onClick={onClose} className="hover:cursor-pointer p-1">
            <FiX className="text-2xl transition-all duration-300 font-extrabold hover:text-red-600" />
          </div>
        </div>
        {/* Form */}
        <form
          className="grid grid-cols-9 min-h-[320px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="h-full col-span-3 bg-orange-300 ">
            <img src={sideimg} alt="" />
          </div>
          <div className="col-span-6  ">
            <div className="flex justify-center px-4">
              <div className="flex flex-col mr-10 mt-6">
                <div className="mt-5 w-full">
                  <InputField
                    ctype="text"
                    id="candidateEmail"
                    clable="Candidate Email"
                    css1={bgColor}
                    {...register("candidate_email", {
                      required: "Candidate email is required",
                    })}
                  />
                  {errors.candidate_email && (
                    <p className="text-red-500 text-xs">
                      {errors.candidate_email.message}
                    </p>
                  )}
                </div>
                <div className="mt-5 w-full">
                  <InputField
                    ctype="number"
                    id="allocatedTime"
                    clable="Allocated Time (minutes)"
                    css1={bgColor}
                    {...register("allocated_time", {
                      required: "Allocated time is required",
                    })}
                  />
                  {errors.allocated_time && (
                    <p className="text-red-500 text-xs">
                      {errors.allocated_time.message}
                    </p>
                  )}
                </div>
                <div className="mt-5 w-full flex items-center">
                  <input
                    type="checkbox"
                    id="negativeMarking"
                    {...register("negative_marking")}
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
                <div className="mt-5 w-full">
                  <label className="block text-sm font-semibold mb-1">
                    Difficulty Level
                  </label>
                  <select
                    className="w-full border-2 border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    {...register("difficulty_level")}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Include">Include</option>
                  </select>
                </div>
                <div className="mt-5 w-full">
                  <label className="block text-sm font-semibold mb-1">
                    Template
                  </label>
                  <select
                    className="w-full border-2 border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    {...register("template_id", {
                      required: "Please select a template",
                    })}
                  >
                    <option value="">Select Template</option>
                    {templates.map((temp) => (
                      <option key={temp.id} value={temp.id}>
                        {temp.name}
                      </option>
                    ))}
                  </select>
                  {errors.template_id && (
                    <p className="text-red-500 text-xs">
                      {errors.template_id.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-center items-end mt-8">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-sunglow mb-4 font-semibold hover:text-black hover:cursor-pointer text-white px-4 py-2 rounded-lg mr-2 disabled:opacity-75 disabled:cursor-not-allowed transition-opacity"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <ImSpinner8 className="animate-spin" />
                        <span>Saving...</span>
                      </span>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {apiError && (
              <p className="text-red-500 col-span-6 text-center text-sm mx-auto mt-2 px-4 max-w-[90%]">
                {apiError}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAssessmentModel;
