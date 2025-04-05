import React from "react";
import { FiX, FiEdit, FiMove } from "react-icons/fi";

function TemplateQuestionCard({ question, categories, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <FiMove className="text-gray-400 cursor-move mr-2" />
          <span className="text-sm font-medium text-gray-700">
            {categories.find((c) => c.id === question.category)?.name ||
              "Uncategorized"}
          </span>
          <span className="text-sm text-gray-500">
            (Weight: {question.weight}%)
          </span>
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-2">
        <p className="font-medium">{question.text}</p>
        {question.type === "mcq" && (
          <div className="mt-2 space-y-1">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm">{option}</span>
                {question.correctAnswer === option && (
                  <span className="text-green-500 text-sm">✓ Correct</span>
                )}
              </div>
            ))}
          </div>
        )}
        {question.type === "open" && (
          <div className="mt-2 text-sm text-gray-500">Open-ended response</div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FiEdit className="w-4 h-4" />
        <span>Click to edit</span>
      </div>
    </div>
  );
}

export default TemplateQuestionCard;
