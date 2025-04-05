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
}) {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  // Local state for editing category name and weight.
  const [editName, setEditName] = useState(title);
  const [editWeight, setEditWeight] = useState(weight);

  useEffect(() => {
    // Whenever the props change, reset local editing values.
    setEditName(title);
    setEditWeight(weight);
  }, [title, weight]);

  const toggleExpand = () => {
    // If currently in edit mode, collapse first.
    if (editing) {
      onCancelEdit();
    }
    setIsExpanded((prev) => !prev);
  };

  const handleSave = () => {
    // Validate if needed before updating.
    onUpdateCategory(id, editName, editWeight);
  };

  const handleRemoveQuestion = (categoryId, questionId) => {
    // You already have a removeQuestion dispatch here.
    dispatch(removeQuestion({ categoryId, questionId }));
  };

  return (
    <div className="md:max-w-dash-lg max-w-dash mt-templist md:mt-templist-md">
      <div
        onClick={toggleExpand}
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
      {isExpanded && !editing && (
        <div className="ml-4 mt-2">
          {questions.map((question) => (
            <div className="flex items-center gap-3" key={question.id}>
              <div className="grow">
                <QuestionItem
                  question={question}
                  fontsize="text-12"
                  margin="mt-2"
                  checkbox={checkbox}
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
