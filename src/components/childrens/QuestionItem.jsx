import React from "react";
import { useDispatch, useSelector } from "react-redux";

// Import your actions from your Redux slice
import {
  addSelectedQuestion,
  removeSelectedQuestion,
} from "../../features/categorySlice";

export default function QuestionItem({
  question,
  margin = "",
  fontsize = "",
  checkbox = false,
  expanded = false,
  onToggle = () => {},
}) {
  const dispatch = useDispatch();
  // Get selected questions from Redux store
  const selected = useSelector((state) => state.category?.selected || []);
  let type = "mcq";
  if (question.options) {
    type = "mcq";
  } else {
    type = "openEnded";
  }
  // Handle checkbox changes: dispatch add or remove action based on checked state.
  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      dispatch(addSelectedQuestion(question.id));
    } else {
      dispatch(removeSelectedQuestion(question.id));
    }
  };

  return (
    <div className="p-2 md:p-4 my-1 rounded-lg bg-white">
      {/* Question header */}
      <div className="flex px-2">
        {checkbox && (
          <input
            type="checkbox"
            className="mr-5 p-5 hover:cursor-pointer"
            onChange={handleCheckboxChange}
            checked={selected.includes(question.id)}
          />
        )}
        <div
          className="flex grow justify-between items-center cursor-pointer"
          onClick={onToggle}
        >
          <span className={`font-medium text-14 max-w-[70%] ${fontsize}`}>
            {question.text}
          </span>
          <span className={`${fontsize}`}>Weight: {question.weight}</span>
        </div>
      </div>

      {/* Expandable details: options and correct answer */}
      {expanded && (
        <div className={`ml-4 mt-1 ${margin} ${fontsize}`}>
          {type === "mcq" ? (
            <div>
              <ul className="list-disc ml-4">
                <li>Option 1: {question.options?.option1}</li>
                <li>Option 2: {question.options?.option2}</li>
                <li>Option 3: {question.options?.option3}</li>
                <li>Option 4: {question.options?.option4}</li>
              </ul>
              <p className={margin}>
                <strong>Correct Answer:</strong> {question.correct_answer}
              </p>
            </div>
          ) : (
            <p className={margin}>
              <strong>Correct Answer:</strong> {question.correct_answer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
