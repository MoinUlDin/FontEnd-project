import React from "react";

export default function TestSidebar({ questions, current, answers, onJump }) {
  return (
    <div>
      <h3 className="font-bold mb-2">Questions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-9 gap-2">
        {questions.map((question, index) => {
          // Check if this question (by its id) has been answered.
          const answered = Boolean(answers[question.id]);
          return (
            <button
              key={question.id} // use question id as key
              onClick={() => onJump(index)}
              className={`w-10 h-10 rounded-full border hover:cursor-pointer hover:bg-blue-200 flex items-center justify-center ${
                current === index
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              } ${answered ? "border-green-800 border-2" : "border-gray-300"}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-sm">
        {Object.keys(answers).length} / {questions.length} answered
      </div>
    </div>
  );
}
