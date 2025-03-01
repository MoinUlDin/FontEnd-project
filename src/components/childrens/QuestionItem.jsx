// QuestionItem.jsx
import React, { useState } from "react";

export default function QuestionItem({ question, margin = "", fontsize = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="p-2 md:p-4 my-1 rounded-lg bg-white">
      {/* Question header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <span className={`font-medium text-14 max-w-[70%] ${fontsize}`}>
          {question.text}
        </span>
        <span className={`${fontsize}`}>Weight: {question.weight}</span>
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
          <p className={`${margin}`}>
            <strong>Correct Answer:</strong> {question.correct_answer}
          </p>
        </div>
      )}
    </div>
  );
}
