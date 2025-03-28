// src/pages/TestLandingPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ProfileUpdatePopup from "../components/Forms/ProfileUpdatePopup";

// Helper function to open a new window with full-screen/toolbar=no settings.
const openTestWindow = (testUrl) => {
  // Opens in a new window/tab. Adjust the features string as needed.
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
  const [showProfileForm, setShowProfileForm] = useState(true);
  const progressKey = `testProgress_${test_instance_id}`;
  const progress = localStorage.getItem(progressKey);

  useEffect(() => {
    if (progress) {
      setShowProfileForm(false);
    }
  }, []);
  const handleStartTest = () => {
    // Construct the absolute URL (including protocol and host)
    const testUrl = `${window.location.origin}/tests/take_test/${test_instance_id}/?token=${token}`;
    openTestWindow(testUrl);
    // Optionally navigate the landing page to a waiting or information route.
    navigate("/"); // Adjust this route as needed.
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-100">
      {showProfileForm && <ProfileUpdatePopup onClose={setShowProfileForm} />}

      <h1 className="text-3xl font-bold mb-4">Ready to Start Your Test?</h1>
      <p className="mb-8 text-lg">
        For security reasons, your test will open in a separate window. Please
        ensure you allow popups.
      </p>
      <button
        onClick={handleStartTest}
        className="bg-blue-600 ptr hover:bg-blue-800 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Start Test
      </button>
    </div>
  );
};

export default TestLandingPage;
