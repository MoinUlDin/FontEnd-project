// src/components/childrens/TestSidebar.jsx
import React from "react";

export default function TestSidebar({ total, current, answers, onJump }) {
  return (
    <div>
      <h3 className="font-bold mb-2">Questions</h3>
      <div className="grid grid-cols-9 gap-2">
        {Array.from({ length: total }, (_, index) => {
          // Determine if the question (by ID) is answered.
          // Since answers is keyed by question id, and we only have the index here,
          // we assume that testData.questions is ordered. We'll get the key from there.
          // A more robust approach is to pass in the questions array, but for now we assume index order.
          const answered =
            Object.values(answers).some(
              (ans) =>
                ans.question_id === (answers && Object.keys(answers)[index])
            ) || false;
          return (
            <button
              key={index}
              onClick={() => onJump(index)}
              className={`w-10 h-10 rounded-full border hover:cursor-pointer hover:bg-blue-200 flex items-center justify-center ${
                current === index
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              } ${answered ? "border-green-500" : "border-gray-300"}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-sm">
        {Object.keys(answers).length} / {total} answered
      </div>
    </div>
  );
}
