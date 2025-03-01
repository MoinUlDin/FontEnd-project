// src/pages/TestPage.jsx
import React, { useState, useEffect } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../services/apiClient";
import TestSidebar from "../components/childrens/TestSidebar";
import { setTestData } from "../features/assessmentSlice"; // your slice with testData property
import QuestionCard from "../components/childrens/QuestionCard";
import {
  submitTestStart,
  submitTestSuccess,
  submitTestFailure,
} from "../features/testSubmissionSlice";
import Timer from "../components/childrens/Timer";
import { logoutAndClear } from "../features/authslice";

// Utility hook to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function TestPage() {
  const { test_instance_id } = useParams();
  const testData = useSelector((state) => state.assessment.testData);
  const query = useQuery();
  const token = query.get("token");
  const dispatch = useDispatch();
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { answers, loading: submitting } = useSelector(
    (state) => state.testSubmission
  );

  // Force logout any previous user on mount
  useEffect(() => {
    localStorage.removeItem("userData");
    dispatch(logoutAndClear());
  }, [dispatch]);

  // Update remainingTime once testData is available
  useEffect(() => {
    if (testData && testData.allocated_time) {
      // Check if a start time is already stored
      let storedStartTime = localStorage.getItem("testStartTime");
      if (!storedStartTime) {
        storedStartTime = Date.now();
        localStorage.setItem("testStartTime", storedStartTime);
      }
      // Convert allocated_time from testData to a number (seconds)
      const allocatedTime = parseInt(testData.allocated_time, 10);
      // Calculate elapsed time in seconds
      const elapsedSeconds = Math.floor((Date.now() - storedStartTime) / 1000);
      // Set remaining time (ensure it doesn't go negative)
      const newRemainingTime = Math.max(allocatedTime - elapsedSeconds, 0);
      setRemainingTime(newRemainingTime);
    }
  }, [testData]);

  // Fetch test data on mount
  useEffect(() => {
    if (test_instance_id && token) {
      const fetchTestData = async () => {
        try {
          const response = await apiClient.get(
            `tests/take_test/${test_instance_id}/?token=${token}`
          );
          if (response.data.access_token) {
            localStorage.setItem(
              "userData",
              JSON.stringify({ accessToken: response.data.access_token })
            );
          }
          dispatch(setTestData(response.data));
        } catch (error) {
          console.error("Error fetching test data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTestData();
    }
  }, [test_instance_id, token, dispatch]);

  // This callback is called when a question is saved.
  const handleNextQuestion = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleSubmitTest = async () => {
    try {
      dispatch(submitTestStart());
      const response = await apiClient.post("tests/submit_test/", {
        test_instance_id,
        answers: Object.values(answers),
      });
      dispatch(submitTestSuccess());
      alert("Test submitted successfully!");
      const navigate = useNavigate();
      navigate("/");
    } catch (error) {
      dispatch(
        submitTestFailure(error.response?.data?.message || error.message)
      );
      alert(
        "Submission failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  if (loading) {
    return <div>Loading test...</div>;
  }
  return (
    <div className="p-4 inset-0 grid grid-cols-12 gap-4 md:gap-8">
      <div className="col-span-12">
        <Timer
          remainingTime={remainingTime}
          setRemainingTime={setRemainingTime}
        />
      </div>

      {/* Main Question Area */}
      <div className="flex-1 col-span-8">
        {testData.questions?.length > 0 && (
          <QuestionCard
            question={testData.questions[currentQuestion]}
            // Look up current answer by question.id from Redux
            currentAnswer={answers[testData.questions[currentQuestion].id]}
            onSave={handleNextQuestion}
          />
        )}
      </div>
      {/* Sidebar */}
      <div className="col-span-4">
        <TestSidebar
          total={testData.questions.length}
          current={currentQuestion}
          answers={answers}
          onJump={(num) => setCurrentQuestion(num)}
        />
        <button
          onClick={handleSubmitTest}
          disabled={submitting}
          className="mt-4 bottom-0 bg-sunglow hover:cursor-pointer text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Test"}
        </button>
      </div>
    </div>
  );
}
