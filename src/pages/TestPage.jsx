// src/pages/TestPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../services/apiClient";
import TestSidebar from "../components/childrens/TestSidebar";
import { setTestData } from "../features/assessmentSlice";
import QuestionCard from "../components/childrens/QuestionCard";
import {
  submitTestStart,
  submitTestSuccess,
  submitTestFailure,
  restoreAnswers,
} from "../features/testSubmissionSlice";
import Timer from "../components/childrens/Timer";
import { logoutAndClear } from "../features/authslice";
import { ImSpinner8 } from "react-icons/im";
import Toast from "../components/childrens/FloatingMessage";
import TestWindowWrapper from "../components/TestWindowWrapper";

// Utility hook to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function TestPage() {
  const { test_instance_id } = useParams();
  const query = useQuery();
  const token = query.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { answers, loading: submitting } = useSelector(
    (state) => state.testSubmission
  );
  const testData = useSelector((state) => state.assessment.testData);

  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const progressKey = `testProgress_${test_instance_id}`;

  // Restore progress from localStorage if available.
  useEffect(() => {
    const storedProgress = localStorage.getItem(progressKey);
    if (storedProgress) {
      try {
        const parsedProgress = JSON.parse(storedProgress);
        if (parsedProgress.answers) {
          dispatch(restoreAnswers(parsedProgress.answers));
        }
        if (parsedProgress.timeStarted) {
          localStorage.setItem("testStartTime", parsedProgress.timeStarted);
        }
      } catch (error) {
        console.error("Error restoring test progress:", error);
      }
    }
  }, [test_instance_id, dispatch, progressKey]);

  // Save progress to localStorage whenever answers change.
  useEffect(() => {
    if (test_instance_id && testData) {
      const progress = {
        allocatedTime: testData.allocated_time,
        timeStarted: localStorage.getItem("testStartTime") || Date.now(),
        answers,
      };
      localStorage.setItem(progressKey, JSON.stringify(progress));
    }
  }, [answers, test_instance_id, testData, progressKey]);

  // Fetch test data on mount.
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
          setError(true);
          setApiErrorMsg(error.message);
          console.error("Error fetching test data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTestData();
    }
  }, [test_instance_id, token, dispatch]);

  // Calculate remaining time using stored testStartTime.
  useEffect(() => {
    if (testData && testData.allocated_time) {
      let storedStartTime = localStorage.getItem("testStartTime");
      if (!storedStartTime) {
        storedStartTime = Date.now();
        localStorage.setItem("testStartTime", storedStartTime);
      }
      const allocatedTime = parseInt(testData.allocated_time, 10);
      const elapsedSeconds = Math.floor((Date.now() - storedStartTime) / 1000);
      const newRemainingTime = Math.max(allocatedTime - elapsedSeconds, 0);
      setRemainingTime(newRemainingTime);
    }
  }, [testData]);

  // Auto-submit test when time runs out with a 5-second delay, only once.
  useEffect(() => {
    if (!autoSubmitted && remainingTime <= 0 && !submitting && !loading) {
      setToastMessage("Test will be auto-submitted in 5 seconds.");
      setShowToast(true);
      const timeoutId = setTimeout(() => {
        confirmSubmitTest();
        setAutoSubmitted(true);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [remainingTime, submitting, loading, autoSubmitted]);

  const handleNextQuestion = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Manual submission (if user clicks the button)
  const handleSubmitTest = async () => {
    confirmSubmitTest();
  };

  // confirmSubmitTest: auto-submit the test without confirmation.
  const confirmSubmitTest = async () => {
    setLoading(true);
    try {
      dispatch(submitTestStart());
      const response = await apiClient.post("tests/submit_test/", {
        test_instance_id,
        answers: Object.values(answers),
      });
      dispatch(submitTestSuccess());
      setToastMessage("Test submitted successfully!");
      setShowToast(true);
      navigate("/");
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      dispatch(submitTestFailure(errMsg));
      setToastMessage("Submission failed: " + errMsg);
      setShowToast(true);
      // If error indicates that the test is already submitted, mark as autoSubmitted
      if (errMsg === "Test already submitted.") {
        setAutoSubmitted(true);
      }
      dispatch(logoutAndClear());
    } finally {
      setLoading(false);
      localStorage.removeItem(progressKey);
      localStorage.removeItem("testStartTime");
      localStorage.removeItem("testInstanceId");
      dispatch(logoutAndClear());
    }
  };

  useEffect(() => {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error("Error attempting to enable full-screen mode:", err);
    });
  }, []);

  if (loading) {
    return (
      <TestWindowWrapper>
        <div className="fixed inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-4xl flex gap-10">
            <ImSpinner8 className="animate-spin" />
            <div>
              <h1 className="text-black font-extrabold">Loading test...</h1>
              <h4 className="text-xl text-gray-800">
                Setting up environment, Please wait.
              </h4>
            </div>
          </div>
        </div>
      </TestWindowWrapper>
    );
  }
  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-200 flex items-center justify-center">
        <div className="text-4xl">
          <h1 className="text-red-500">Error: {apiErrorMsg}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 inset-0 grid grid-cols-12 gap-4 md:gap-8">
      <div className="col-span-12">
        <Timer
          remainingTime={remainingTime}
          setRemainingTime={setRemainingTime}
          testInstanceId={test_instance_id}
          allocatedTime={parseInt(testData.allocated_time, 10)}
        />
      </div>
      {/* Main Question Area */}
      <div className="flex-1 col-span-8">
        {testData.questions?.length > 0 && (
          <QuestionCard
            question={testData.questions[currentQuestion]}
            currentAnswer={answers[testData.questions[currentQuestion].id]}
            onSave={handleNextQuestion}
          />
        )}
      </div>
      {/* Sidebar */}
      <div className="col-span-4">
        <TestSidebar
          questions={testData.questions}
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
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
