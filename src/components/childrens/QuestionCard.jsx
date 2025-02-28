// src/components/childrens/QuestionCard.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveAnswer } from "../../features/testSubmissionSlice";

export default function QuestionCard({ question, currentAnswer, onSave }) {
  const dispatch = useDispatch();
  const savedAnswer = useSelector(
    (state) => state.testSubmission.answers[question.id]?.answer_text
  );
  const [selectedOption, setSelectedOption] = useState(savedAnswer || "");

  useEffect(() => {
    setSelectedOption(savedAnswer || "");
  }, [question.id, savedAnswer]);

  const handleSave = () => {
    dispatch(
      saveAnswer({
        questionId: question.id,
        answer: {
          question_id: question.id,
          question_text: question.text,
          answer_text: selectedOption,
          question_type: question.question_type,
        },
      })
    );
    onSave();
  };

  return (
    <div className="bg-white p-6 h-svh rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">{question.text}</h2>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(question.options).map(([key, text]) => (
          <button
            key={key}
            onClick={() => setSelectedOption(key)}
            className={`border rounded p-2 hover:cursor-pointer text-left transition-colors ${
              selectedOption === key
                ? "bg-blue-200 border-blue-500"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={!selectedOption}
          className="bg-blue-600 text-white hover:cursor-pointer px-4 py-2 rounded disabled:opacity-50"
        >
          Save & Next
        </button>
        <button
          onClick={() => onSave()}
          disabled={selectedOption}
          className="bg-red-400 text-white hover:cursor-pointer px-4 py-2 rounded disabled:opacity-50"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
