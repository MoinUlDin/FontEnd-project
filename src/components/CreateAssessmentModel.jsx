import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import AssessmentService from "../services/assessmentService";
import TempService from "../services/tempService";
import { useDispatch, useSelector } from "react-redux";
import { ImSpinner8 } from "react-icons/im";
import { FiX, FiPlus } from "react-icons/fi";
import sideimg from "../assets/report.avif";
import { TextField, Autocomplete, Button } from "@mui/material";

// ... (other imports)

function CreateAssessmentModel({ onClose, selectedTemplateId }) {
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Get template list from Redux; convert to an array.
  const templatesObj = useSelector((state) => state.templates.list || {});
  const templatesArray = Object.values(templatesObj);

  // Get company settings from Redux (which holds default difficulty level)
  const settings = useSelector((state) => state.settings.settings);

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
    reset,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      candidate_emails: [""], // initialize with one empty field
      allocated_time: "",
      job_role: "",
      negative_marking: false,
      // Use settings.default_difficulty_level if available; otherwise default to "Easy"
      difficulty_level: settings?.default_difficulty_level || "Easy",
      template: selectedTemplate ? selectedTemplate : null,
      description: "",
    },
    mode: "onBlur",
  });

  // Update the difficulty level default value when settings load.
  useEffect(() => {
    if (settings && settings.default_difficulty_level) {
      reset((prev) => ({
        ...prev,
        difficulty_level: settings.default_difficulty_level,
      }));
    }
  }, [settings, reset]);

  // Setup dynamic candidate email fields.
  const { fields, append, remove } = useFieldArray({
    control,
    name: "candidate_emails",
  });

  // Ensure at least one email field is present on initial render.
  useEffect(() => {
    if (fields.length === 0) {
      append("");
    }
  }, [fields, append]);

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

    // Common payload values for each candidate
    const basePayload = {
      allocated_time: data.allocated_time,
      negative_marking: data.negative_marking,
      difficulty_level: data.difficulty_level,
      job_role: data.job_role,
      template_id: data.template ? data.template.id : "",
      description: data.description,
    };

    let results = [];

    // Process candidate emails sequentially.
    for (const email of data.candidate_emails) {
      try {
        await AssessmentService.createAssessment(
          { ...basePayload, candidate_email: email },
          dispatch
        );
        results.push({ email, success: true });
      } catch (error) {
        console.log("error", error);
        results.push({ email, success: false, error });
      }
    }

    // Identify failed emails.
    const failedAttempts = results.filter((r) => !r.success);

    // Retry failed emails sequentially once.
    if (failedAttempts.length > 0) {
      let retryResults = [];
      for (const attempt of failedAttempts) {
        try {
          await AssessmentService.createAssessment(
            { ...basePayload, candidate_email: attempt.email },
            dispatch
          );
          retryResults.push({ email: attempt.email, success: true });
        } catch (error) {
          retryResults.push({ email: attempt.email, success: false, error });
        }
      }

      // Final check for any failed emails.
      const finalFailures = retryResults.filter((r) => !r.success);
      if (finalFailures.length > 0) {
        alert(
          `Some candidate emails failed: ${finalFailures
            .map((f) => f.email)
            .join(", ")}. ${results.map((m) => m.error).join(",")}`
        );
        reset({
          candidate_emails: [""],
          allocated_time: "",
          job_role: "",
          negative_marking: false,
          difficulty_level: settings?.default_difficulty_level || "Easy",
          template: selectedTemplate ? selectedTemplate : null,
          description: "",
        });
      } else {
        onClose();
      }
    } else {
      onClose();
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 drop-shadow-2xl shadow-black">
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl overflow-hidden min-h-90 z-10 max-w-[95svw] border-2 border-amber-700">
        {/* Header */}
        <div className="text-xl flex px-3 md:px-5 justify-between font-bold bg-black py-4 text-white">
          <h2>Create Assessment</h2>
          <div onClick={onClose} className="hover:cursor-pointer p-1">
            <FiX className="text-2xl transition-all duration-300 font-extrabold hover:text-red-600" />
          </div>
        </div>
        {/* Form */}
        <form
          className="grid grid-cols-10 max-h-[90svh] overflow-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="h-full p-3 col-span-10 md:col-span-4 flex flex-col justify-center">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center">
                <TextField
                  id={`candidate_emails_${index}`}
                  label="Candidate Email"
                  variant="outlined"
                  margin="normal"
                  size="small"
                  {...register(`candidate_emails.${index}`, {
                    required: "Candidate email is required",
                  })}
                />
                {index === fields.length - 1 && (
                  <button
                    type="button"
                    onClick={() => append("")}
                    className="ml-2 mt-3 ptr"
                    title="Add another candidate email"
                  >
                    <FiPlus className="text-xl text-blue-800" />
                  </button>
                )}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="ml-2 mt-3"
                    title="Remove candidate email"
                  >
                    <FiX className="text-xl text-red-600" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="col-span-10 md:col-span-6">
            <div className="grid grid-cols-2 justify-center px-4">
              <div className="flex flex-col max-w-50 col-span-2 xs:col-span-1 mr-10 mt-6">
                <div className="w-full">
                  <TextField
                    id="job_role"
                    label="Job Role"
                    variant="outlined"
                    margin="normal"
                    size="small"
                    {...register("job_role", {
                      required: "Job role is required",
                    })}
                  />
                  {errors.job_role && (
                    <p className="text-red-500 text-xs">
                      {errors.job_role.message}
                    </p>
                  )}
                </div>
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
              <div className="flex flex-col col-span-2 xs:col-span-1">
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
