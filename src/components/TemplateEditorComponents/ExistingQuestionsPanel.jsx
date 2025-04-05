// src/components/TemplateEditorComponents/ExistingQuestionsPanel.jsx
import React, { useState } from "react";
import { FiX } from "react-icons/fi";

export default function ExistingQuestionsPanel({ onClose, onSelect }) {
  const existingQuestions = useSelector((state) =>
    state.templates.templates.flatMap((t) => t.questions)
  );
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleToggleQuestion = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = () => {
    const questionsToAdd = existingQuestions.filter((q) =>
      selectedQuestions.includes(q.id)
    );
    onSelect(questionsToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Existing Questions</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="h-96 overflow-y-auto space-y-2">
          {existingQuestions.map((question) => (
            <label
              key={question.id}
              className="flex items-center p-3 hover:bg-gray-50 rounded border"
            >
              <input
                type="checkbox"
                checked={selectedQuestions.includes(question.id)}
                onChange={() => handleToggleQuestion(question.id)}
                className="mr-3"
              />
              <div className="flex-1">
                <p className="font-medium">{question.text}</p>
                <p className="text-sm text-gray-500">
                  {question.type.toUpperCase()} - {question.category?.name}
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Selected ({selectedQuestions.length})
          </button>
        </div>
      </div>
    </div>
  );
}
