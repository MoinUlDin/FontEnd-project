// TestPage.jsx
import React, { useState, useEffect } from "react";
import QuestionCard from "../components/childrens/QuestionCard";
import Sidebar from "../components/childrens/Sidebar";
import Timer from "../components/childrens/Timer";

const questionsData = [
  // Array of question objects from API
];

export default function TestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { 0: "option3", 1: "option1", ... }
  const [remainingTime, setRemainingTime] = useState(3600); // e.g., in seconds

  // Handle saving answer and move to next
  const handleAnswerSave = (questionIndex, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: selectedOption }));
    if (questionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(questionIndex + 1);
    }
  };

  // Handle jump from sidebar
  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Main Question Area */}
      <div className="flex-1 p-4">
        <QuestionCard
          question={questionsData[currentQuestionIndex]}
          currentAnswer={answers[currentQuestionIndex]}
          onSave={(selectedOption) =>
            handleAnswerSave(currentQuestionIndex, selectedOption)
          }
        />
      </div>
      {/* Right Sidebar */}
      <div className="w-full md:w-1/4 p-4 bg-gray-100">
        <Timer
          remainingTime={remainingTime}
          setRemainingTime={setRemainingTime}
        />
        <Sidebar
          total={questionsData.length}
          current={currentQuestionIndex}
          answers={answers}
          onJump={jumpToQuestion}
        />
      </div>
    </div>
  );
}
