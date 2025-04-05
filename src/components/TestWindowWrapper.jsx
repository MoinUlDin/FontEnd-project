// src/components/TestWindowWrapper.jsx
import React, { useState, useEffect } from "react";
import WarningDialog from "./Forms/WarningDialog";
import Toast from "./childrens/FloatingMessage";

export default function TestWindowWrapper({ children }) {
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Handle page visibility changes (e.g. switching tabs or minimizing)
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      setShowCheatWarning(true);
      setToastMessage(
        "Warning: You have switched tabs/windows! Please return to the test."
      );
    } else {
      setShowCheatWarning(false);
    }
  };

  // Also catch window blur/focus events.
  const handleWindowBlur = () => {
    setShowCheatWarning(true);
    setToastMessage(
      "Warning: Test window lost focus! Next time test will be submitted automatically"
    );
  };

  const handleWindowFocus = () => {
    setShowCheatWarning(false);
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  const confirmWarning = () => {
    setShowCheatWarning(false);
  };

  return (
    <div>
      {children}
      {showCheatWarning && (
        <WarningDialog
          message={toastMessage}
          confirmbtnText="I am here"
          onConfirm={confirmWarning}
          onCancel={confirmWarning}
        />
      )}
      {toastMessage && !showCheatWarning && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
}
