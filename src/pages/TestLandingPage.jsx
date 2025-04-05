// src/pages/TestLandingPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// Helper function to open a new window with full-screen/toolbar=no settings.
const openTestWindow = (testUrl) => {
  const screenWidth = window.screen.availWidth;
  const screenHeight = window.screen.availHeight;
  const newWindow = window.open(
    testUrl,
    "_blank",
    `toolbar=no,scrollbars=yes,resizable=yes,width=${screenWidth},height=${screenHeight}`
  );
  if (newWindow) {
    newWindow.focus();
  } else {
    alert("Please allow popups for this website.");
  }
};

const TestLandingPage = () => {
  const navigate = useNavigate();
  const { test_instance_id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  // State for showing terms and accepting them
  const [accepted, setAccepted] = useState(false);
  const progressKey = `testProgress_${test_instance_id}`;
  const progress = localStorage.getItem(progressKey);

  useEffect(() => {
    if (progress) {
      // handleStartTest();
    }
  }, [progress]);

  const handleStartTest = () => {
    const testUrl = `${window.location.origin}/tests/take_test/${test_instance_id}/?token=${token}`;
    openTestWindow(testUrl);

    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-100">
      <h1 className="text-3xl text-blue-900 font-bold mb-4">
        Test Terms and Conditions
      </h1>
      <div className="bg-white p-6 px-15 rounded shadow-md max-w-2xl mb-6">
        <ol className="list-decimal ml-6 space-y-5 text-gray-700">
          <li>The test will open in a new window.</li>
          <li>
            You are not permitted to switch tabs or windows during the test.
          </li>
          <li>You are not allowed to minimize the test window.</li>
          <li>No other windows may overlap the test window.</li>
          <li>
            If any of the above conditions are violated, the test will be
            automatically submitted as failed due to cheating.
          </li>
        </ol>
      </div>
      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          id="acceptTerms"
          className="mr-2"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <label htmlFor="acceptTerms" className="text-gray-700">
          I have read and understand the above terms and conditions.
        </label>
      </div>
      <button
        onClick={handleStartTest}
        disabled={!accepted}
        className={`bg-blue-600 ptr hover:bg-blue-800 text-white px-6 py-3 rounded-lg transition-colors ${
          !accepted ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Start Test
      </button>
    </div>
  );
};

export default TestLandingPage;
