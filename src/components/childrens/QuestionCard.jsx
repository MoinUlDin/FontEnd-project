// QuestionCard.jsx
import React, { useState } from "react";

export default function QuestionCard({ question, currentAnswer, onSave }) {
  const [selectedOption, setSelectedOption] = useState(currentAnswer || "");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">{question.text}</h2>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(question.options).map(([key, text]) => (
          <button
            key={key}
            onClick={() => handleOptionClick(key)}
            className={`border rounded p-2 text-left ${
              selectedOption === key
                ? "bg-blue-200 border-blue-500"
                : "border-gray-300"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onSave(selectedOption)}
          disabled={!selectedOption}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Save & Next
        </button>
      </div>
    </div>
  );
}
