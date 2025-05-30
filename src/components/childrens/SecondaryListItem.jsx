import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem"; // Your question component
import { useDispatch, useSelector } from "react-redux";
import CategoryService from "../../services/categoriesService";
import { FaTrash } from "react-icons/fa";
import { removeQuestion, addCategory } from "../../features/templateSlice";
import { GrClone } from "react-icons/gr";

function SecondaryListItem({
  title,
  id,
  weight,
  questions = [],
  checkbox = false,
  bin = false,
  editable = false, // new prop
  showclone = false, // new prop
  expanded, // prop to control if the category is expanded
  onToggle, // callback to toggle category expansion
  selectedQuestions = [], // passed global selected question IDs
}) {
  const dispatch = useDispatch();
  // For editable mode, use questions from parent; otherwise, maintain local state.
  const [localQuestions, setLocalQuestions] = useState(questions);

  // State to control which question is expanded within this category.
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  // Only fetch API data if not in editable mode.
  const storedDetail = useSelector((state) =>
    editable ? null : state.category.details[id]
  );

  useEffect(() => {
    // If NOT editable, merge in API data.
    if (!editable) {
      if (storedDetail?.questions?.length > 0) {
        setLocalQuestions(storedDetail.questions);
      } else if (questions.length > 0) {
        setLocalQuestions(questions);
      }
    }
  }, [questions, editable, storedDetail]);

  useEffect(() => {
    if (
      !editable &&
      id !== undefined &&
      expanded && // Only fetch when the category is expanded.
      localQuestions.length === 0 &&
      !storedDetail
    ) {
      if (
        storedDetail &&
        storedDetail.questions &&
        storedDetail.questions.length > 0
      ) {
        if (storedDetail?.questions) {
          setLocalQuestions(storedDetail.questions);
        }
      } else {
        CategoryService.fetchDetailedCategory(dispatch, id).catch((error) => {
          console.error("Error fetching category details: ", error);
        });
      }
    }
  }, [expanded, localQuestions, storedDetail, dispatch, id, editable]);

  const handleRemoveQuestion = (categoryId, questionId) => {
    dispatch(removeQuestion({ categoryId, questionId }));
  };

  const handleClone = async (e) => {
    e.stopPropagation(); // Prevent triggering the category toggle.
    console.log("Cloning category with ID:", id);

    let detailedCategory;
    try {
      // Force fetch detailed category data even if storedDetail exists.
      detailedCategory = await CategoryService.fetchDetailedCategory(
        dispatch,
        id
      );
    } catch (error) {
      console.error("Error fetching detailed data for clone:", error);
      return; // Optionally, show a message to the user.
    }

    // If detailedCategory is still undefined (should not happen if API call succeeded), log error.
    if (!detailedCategory) {
      console.error("No detailed category data received.");
      return;
    }

    // Now dispatch the cloned category (using the fetched detailed data).
    dispatch(addCategory(detailedCategory));
  };

  return (
    <div className="md:max-w-dash-lg max-w-dash mt-templist md:mt-templist-md">
      <div
        onClick={onToggle} // Use the passed toggle callback for category expansion.
        className="custom_grid bg-white shadow-md rounded-lg p-4 pr-1 hover:shadow-lg hover:shadow-gray-400 hover:scale-x-101 hover:cursor-pointer transition-all duration-100"
      >
        <div className="col-span-3">
          <div className="flex items-center gap-4">
            <p className="text-purple-600 font-semibold text-dash-it hover:underline">
              {title}
            </p>
            {showclone && (
              <div
                onClick={handleClone}
                className="text-[10px] flex flex-col justify-center items-center"
              >
                <GrClone className="text-blue-500" />
                <span>clone</span>
              </div>
            )}
          </div>
        </div>
        <div className="place-self-center text-dash-it">{weight}</div>
        <div className="place-self-center text-dash-it flex gap-2">
          {localQuestions.length}
        </div>
      </div>
      {expanded && (
        <div className="ml-4 mt-2">
          {localQuestions.map((question, index) => (
            <div
              className="flex items-center gap-3"
              key={`${question.id}-${index}`}
            >
              <div className="grow">
                <QuestionItem
                  question={question}
                  fontsize="text-12"
                  margin="mt-2"
                  checkbox={checkbox}
                  expanded={question.id === expandedQuestionId}
                  onToggle={() =>
                    setExpandedQuestionId((prev) =>
                      prev === question.id ? null : question.id
                    )
                  }
                />
              </div>
              {bin && (
                <FaTrash
                  className="hover:text-red-500 text-lg text-blue-700 hover:cursor-pointer"
                  onClick={() => handleRemoveQuestion(id, question.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SecondaryListItem;
