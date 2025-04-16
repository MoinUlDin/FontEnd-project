import React, { useState, useEffect } from "react";
import QuestionItem from "../../components/childrens/QuestionItem";
import { useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { removeQuestion } from "../../features/templateSlice";

function EditAbleList({
  title,
  id,
  weight,
  questions,
  bin,
  checkbox,
  editing,
  onUpdateCategory,
  onCancelEdit,
  onRemove,
  expanded, // prop from parent for category expansion control
  onToggle, // callback from parent to toggle category expansion
}) {
  const dispatch = useDispatch();
  // Local state for editing category name and weight.
  const [editName, setEditName] = useState(title);
  const [editWeight, setEditWeight] = useState(weight);
  // Local state to control which question is expanded (only one at a time).
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  useEffect(() => {
    // Whenever the props change, reset local editing values.
    setEditName(title);
    setEditWeight(weight);
  }, [title, weight]);

  // Toggle for category expansion uses the passed-in callback.
  const toggleCategoryExpand = () => {
    if (editing) {
      onCancelEdit();
    }
    onToggle();
  };

  const handleSave = () => {
    onUpdateCategory(id, editName, editWeight);
  };

  const handleRemoveQuestion = (categoryId, questionId) => {
    dispatch(removeQuestion({ categoryId, questionId }));
  };

  return (
    <div
      key={id}
      className="md:max-w-dash-lg max-w-dash mt-templist md:mt-templist-md"
    >
      <div
        onClick={toggleCategoryExpand}
        className="custom_grid bg-white shadow-md rounded-lg p-4 hover:shadow-lg hover:shadow-gray-400 hover:scale-x-101 hover:cursor-pointer transition-all duration-100"
      >
        <div className="col-span-3">
          {editing ? (
            <input
              value={editName}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setEditName(e.target.value)}
              className="border p-1 rounded"
            />
          ) : (
            <p className="text-purple-600 font-semibold text-dash-it hover:underline">
              {title}
            </p>
          )}
        </div>
        <div className="place-self-center text-dash-it">
          {editing ? (
            <input
              type="number"
              value={editWeight}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setEditWeight(e.target.value)}
              className="border p-1 rounded w-16"
            />
          ) : (
            weight
          )}
        </div>
        <div className="place-self-center text-dash-it">
          {questions?.length}
        </div>
      </div>
      {editing && (
        <div className="flex justify-end gap-3 my-3">
          <button
            onClick={handleSave}
            className="bg-green-500 ptr text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={onCancelEdit}
            className="bg-gray-300 ptr text-black px-2 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}
      {expanded && !editing && (
        <div className="ml-4 mt-2">
          {questions.map((question) => (
            <div className="flex items-center gap-3" key={question.id}>
              <div className="grow">
                <QuestionItem
                  question={question}
                  fontsize="text-12"
                  margin="mt-2"
                  checkbox={checkbox}
                  // Only the question matching expandedQuestionId is expanded.
                  expanded={expandedQuestionId === question.id}
                  // Toggle this question's expansion.
                  onToggle={() =>
                    setExpandedQuestionId(
                      expandedQuestionId === question.id ? null : question.id
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

export default EditAbleList;
