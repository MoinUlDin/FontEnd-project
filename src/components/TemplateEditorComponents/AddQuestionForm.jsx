import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Autocomplete,
  FormControl,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addQuestion } from "../../features/templateSlice";
import { FiXCircle } from "react-icons/fi";
import { FcAddDatabase } from "react-icons/fc";

const AddQuestionForm = ({ onSubmitSuccess, onClose }) => {
  const dispatch = useDispatch();
  const editTemplate = useSelector((state) => state.templates.editTemplate);
  const categoriesArray = editTemplate.categories || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // Use a boolean for question type: true means "mcq", false means "openEnded"
      isMCQ: true,
      questionText: "",
      weight: "",
      category: null,
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctOption: "",
      correctAnswer: "",
    },
  });

  const onSubmit = (data) => {
    // Derive the question type from the checkbox state
    const questionType = data.isMCQ ? "mcq" : "openEnded";

    const newQuestion = {
      id: Date.now().toString(),
      question_type: questionType,
      text: data.questionText,
      weight: Number(data.weight),
      category: data.category ? data.category.id : null,
      options:
        questionType === "mcq"
          ? {
              option1: data.option1,
              option2: data.option2,
              option3: data.option3,
              option4: data.option4,
            }
          : undefined,
      correct_answer:
        questionType === "mcq" ? data.correctOption : data.correctAnswer,
    };

    if (!data.category) return;

    dispatch(
      addQuestion({ categoryId: data.category.id, question: newQuestion })
    );
    reset();
    if (onSubmitSuccess) onSubmitSuccess();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 drop-shadow-2xl shadow-black">
      {/* Overlay that closes the form on click */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>
      {/* Form container with white background */}
      <div className="bg-white relative border-2 outline-0 border-amber-600 rounded-3xl overflow-hidden">
        {/* Close icon */}
        <div className="w-full py-2 px-3 shadow-xl shadow-gray-200 bg-amber-600 items-center flex justify-between">
          <p className="text-lg ml-2 font-bold flex items-center gap-3">
            Add Qustion Form{" "}
            <span>
              <FcAddDatabase />
            </span>
          </p>
          <FiXCircle
            className="text-4xl  ptr hover:text-white hover:font-extrabold p-2 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          {/* Row 1: Question Type (Checkbox) & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Controller
                name="isMCQ"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.isMCQ}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          size="small"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="MCQ (uncheck for Open Ended)"
                    />
                    {errors.isMCQ && (
                      <FormHelperText>{errors.isMCQ.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>
            <div>
              <Controller
                name="weight"
                control={control}
                rules={{
                  required: "Weight is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Weight must be a number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Question Weight"
                    type="number"
                    fullWidth
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Row 2: Question Text & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Controller
                name="questionText"
                control={control}
                rules={{ required: "Question text is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Question Text"
                    fullWidth
                    error={!!errors.questionText}
                    helperText={errors.questionText?.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    size="small"
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={categoriesArray}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        fullWidth
                        error={!!errors.category}
                        helperText={
                          errors.category ? "Category is required" : ""
                        }
                      />
                    )}
                  />
                )}
              />
            </div>
          </div>

          {/* Conditionally render MCQ-specific inputs */}
          {/** If MCQ is selected, display options and correct option input **/}
          <Controller
            name="isMCQ"
            control={control}
            render={({ field: { value } }) =>
              value && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["option1", "option2", "option3", "option4"].map(
                      (option, index) => (
                        <div key={option}>
                          <Controller
                            name={option}
                            control={control}
                            rules={{
                              required: `Option ${index + 1} is required`,
                            }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                label={`Option ${index + 1}`}
                                fullWidth
                                error={!!errors[option]}
                                helperText={errors[option]?.message}
                              />
                            )}
                          />
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-4">
                    <Controller
                      name="correctOption"
                      control={control}
                      rules={{ required: "Please select the correct option" }}
                      render={({ field }) => (
                        <Autocomplete
                          options={["option1", "option2", "option3", "option4"]}
                          getOptionLabel={(option) => option}
                          value={field.value || ""}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="Correct Answer (Select Option)"
                              fullWidth
                              error={!!errors.correctOption}
                              helperText={errors.correctOption?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                </>
              )
            }
          />

          {/* For open-ended questions */}
          <Controller
            name="isMCQ"
            control={control}
            render={({ field: { value } }) =>
              !value && (
                <div className="mt-4">
                  <Controller
                    name="correctAnswer"
                    control={control}
                    rules={{ required: "Correct answer is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        label="Correct Answer"
                        error={!!errors.correctAnswer}
                        helperText={errors.correctAnswer?.message}
                      />
                    )}
                  />
                </div>
              )
            }
          />

          {/* Submit Button */}
          <div className="mt-6 flex justify-end items-center">
            <Button type="submit" variant="contained">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionForm;
