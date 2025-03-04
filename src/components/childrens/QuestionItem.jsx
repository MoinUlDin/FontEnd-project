import React, { useState } from "react";
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
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  const questions = useSelector((state) => {
    if (state.category?.selected.length > 0) {
      return state.category.selected;
    }
  });
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

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
          />
        )}
        <div
          className="flex grow justify-between items-center cursor-pointer"
          onClick={toggleExpand}
        >
          <span className={`font-medium text-14 max-w-[70%] ${fontsize}`}>
            {question.text}
          </span>
          <span className={`${fontsize}`}>Weight: {question.weight}</span>
        </div>
      </div>

      {/* Expandable details: options and correct answer */}
      {isExpanded && (
        <div className={`ml-4 mt-1 ${margin} ${fontsize}`}>
          <ul className="list-disc ml-4">
            <li>Option 1: {question.options.option1}</li>
            <li>Option 2: {question.options.option2}</li>
            <li>Option 3: {question.options.option3}</li>
            <li>Option 4: {question.options.option4}</li>
          </ul>
          <p className={margin}>
            <strong>Correct Answer:</strong> {question.correct_answer}
          </p>
        </div>
      )}
    </div>
  );
}
