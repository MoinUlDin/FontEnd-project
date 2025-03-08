import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AssessmentService from "../services/assessmentService";
import TempService from "../services/tempService";
import { useDispatch, useSelector } from "react-redux";
import { ImSpinner8 } from "react-icons/im";
import sideimg from "../assets/report.avif";
import { FiX } from "react-icons/fi";
import { TextField, Autocomplete, Button } from "@mui/material";

function CreateAssessmentModel({ onClose, selectedTemplateId }) {
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Get template list from Redux; since it's stored as an object, convert to an array.
  const templatesObj = useSelector((state) => state.templates.list || {});
  const templatesArray = Object.values(templatesObj);

  // If selectedTemplateId is provided, find the corresponding template.
  const selectedTemplate = selectedTemplateId
    ? templatesArray.find(
        (temp) => String(temp.id) === String(selectedTemplateId)
      )
    : null;

  // If no templates exist and no selectedTemplateId, fetch templates.
  useEffect(() => {
    if (
      (!templatesArray || templatesArray.length === 0) &&
      !selectedTemplateId
    ) {
      TempService.fetchTemplates(dispatch).catch((error) => setApiError(error));
    }
  }, [templatesArray.length, dispatch, selectedTemplateId]);

  // Initialize react-hook-form with default values.
  const {
    register,
    handleSubmit,
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      candidate_email: "",
      allocated_time: "",
      negative_marking: false,
      difficulty_level: "Easy",
      template: selectedTemplate ? selectedTemplate : null,
      description: "",
    },
    mode: "onBlur",
  });

  // If a selected template is provided, lock the Template field.
  useEffect(() => {
    if (selectedTemplate) {
      setValue("template", selectedTemplate);
    }
  }, [selectedTemplate, setValue]);

  // For difficulty level, we use a simple array.
  const difficultyOptions = ["Easy", "Medium", "Hard", "Include"];

  const onSubmit = async (data) => {
    setApiError("");
    clearErrors();
    setIsSaving(true);
    const payload = {
      candidate_email: data.candidate_email,
      allocated_time: data.allocated_time,
      negative_marking: data.negative_marking,
      difficulty_level: data.difficulty_level,
      template_id: data.template ? data.template.id : "",
      description: data.description,
    };
    try {
      await AssessmentService.createAssessment(payload, dispatch);
      onClose();
    } catch (error) {
      console.error("Error creating assessment:", error);
      let errMsg = error.response?.data?.message;
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.join(" ");
      } else if (!errMsg) {
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
          <div className="h-full col-span-3 bg-orange-300">
            <img src={sideimg} alt="side" />
          </div>
          <div className="col-span-6">
            {/* form input container */}
            <div className="grid grid-cols-2  justify-center px-4">
              {/* form inner left side */}
              <div className="flex flex-col max-w-50  mr-10 mt-6">
                {/* Candidate Email */}
                <div className="w-full">
                  <TextField
                    id="candidate_email"
                    label="Candidate Email"
                    variant="outlined"
                    margin="normal"
                    size="small"
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
                {/* Allocated Time */}
                <div className="mt-5 w-full">
                  <TextField
                    id="allocated_time"
                    label="Allocated Time (minutes)"
                    variant="outlined"
                    margin="normal"
                    size="small"
                    type="number"
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
                {/* Negative Marking Checkbox */}
                <div className="mt-5 w-full flex items-center">
                  <input
                    type="checkbox"
                    id="negative_marking"
                    {...register("negative_marking")}
                    className="mr-2"
                  />
                  <label
                    htmlFor="negative_marking"
                    className="text-sm font-semibold"
                  >
                    Negative Marking
                  </label>
                </div>
              </div>
              {/* form inner right side */}
              <div className="flex flex-col">
                {/* Difficulty Level Autocomplete */}
                <div className="mt-5 w-full">
                  <Controller
                    name="difficulty_level"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={difficultyOptions}
                        getOptionLabel={(option) => option}
                        value={field.value}
                        onChange={(event, newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Difficulty Level"
                            variant="outlined"
                            margin="normal"
                            size="small"
                          />
                        )}
                      />
                    )}
                  />
                </div>
                {/* Template Autocomplete */}
                <div className="mt-5 w-full">
                  <Controller
                    name="template"
                    control={control}
                    rules={{ required: "Please select a template" }}
                    render={({ field }) => (
                      <Autocomplete
                        options={templatesArray}
                        getOptionLabel={(option) => option.name || ""}
                        value={field.value}
                        onChange={(event, newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Template"
                            variant="outlined"
                            margin="normal"
                            size="small"
                          />
                        )}
                        disabled={!!selectedTemplateId}
                      />
                    )}
                  />
                  {errors.template && (
                    <p className="text-red-500 text-xs">
                      {errors.template.message}
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
