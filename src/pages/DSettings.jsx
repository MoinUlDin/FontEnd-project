// src/components/DSettings.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient"; // Axios instance
import { ImSpinner10 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { setDifficultyLevels } from "../features/assessmentSlice";
import GeneralSettings from "../components/GeneralSettings";
import Toast from "../components/childrens/FloatingMessage";

function DSettings() {
  const dispatch = useDispatch();
  const reduxDifficulty = useSelector(
    (state) => state.assessment.difficultyLevels
  );
  const [difficulty, setDifficulty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [showLevelSettings, setShowLevelSettings] = useState(false);

  // Define restrictions for each difficulty level.
  const levelRanges = {
    easy: { min: 3, max: 20 },
    medium: { min: 10, max: 30 },
    hard: { min: 20, max: 50 },
    include: { min: 10, max: 100 },
  };

  // Show level settings only if user is ADMIN or SUPER_ADMIN.
  useEffect(() => {
    console.log("user", user, "User.role", user.role);
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
      setShowLevelSettings(true);
      console.log("after setting showlevelsettings to true", showLevelSettings);
    } else {
      setShowLevelSettings(false);
    }
  }, [user]);

  // Fetch the difficulty levels when the component mounts.
  useEffect(() => {
    // If state from redux is empty or you want to load from the backend.
    console.log("difficulty", difficulty, "ShowLeve", showLevelSettings);
    if (!difficulty && showLevelSettings) {
      console.log("tring to get level settings", loading);
      setLoading(true);
      apiClient
        .get("/tests/difficulty_levels/")
        .then((response) => {
          // Expecting a response like: [{ "Easy": 6, "Medium": 15, "Hard": 23, "Include": 30 }]
          const data = response.data;
          console.log("Data", data);
          if (Array.isArray(data) && data.length > 0) {
            setDifficulty(data[0]);
            // You can also update your redux state if needed.
            console.log("dispatching data");
            dispatch(setDifficultyLevels(data[0]));
          }
        })
        .catch((err) => {
          console.error("Error fetching difficulty levels:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, difficulty, showLevelSettings]);

  // Load preferred difficulty from localStorage for the current user.
  useEffect(() => {
    if (user?.email) {
      const storedPref = localStorage.getItem("userPreferredDifficulty");
      if (storedPref) {
        try {
          const parsed = JSON.parse(storedPref);
          if (parsed.email === user.email) {
            // Optional: you can do something with parsed.difficulty here.
          }
        } catch (e) {
          console.error("Error parsing stored preferred difficulty", e);
        }
      }
    }
  }, [user]);

  // Handler for when an input value changes.
  const handleChange = (level, newValue) => {
    // Get the appropriate range for the level (using lower case)
    const range = levelRanges[level.toLowerCase()];
    if (range) {
      if (newValue < range.min) {
        newValue = range.min;
      }
      if (newValue > range.max) {
        newValue = range.max;
      }
    }
    setDifficulty((prevState) => ({
      ...prevState,
      [level]: newValue,
    }));
  };

  // Submit the updated difficulty levels.
  const handleSubmitLevels = (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    apiClient
      .post("/tests/difficulty_levels/", difficulty)
      .then((response) => {
        setMessage(
          response.data.message || "Difficulty levels updated successfully."
        );
        setShowToast(true);
        // Optionally update redux state.
        dispatch(setDifficultyLevels(difficulty));
      })
      .catch((err) => {
        console.error(err);
        setMessage(
          err.response?.data?.message || "Error updating difficulty levels"
        );
        setShowToast(true);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <ImSpinner10 className="animate-spin mr-2" />
        <span>Loading User Settings...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showLevelSettings && (
        <>
          <h1 className="text-2xl font-bold mb-4">
            Difficulty Levels Settings
          </h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {message && <p className="text-green-500 mb-4">{message}</p>}
          <form onSubmit={handleSubmitLevels}>
            <table className="min-w-full border-collapse mb-4">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left">Level</th>
                  <th className="px-4 py-2 text-left">Number of Questions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Easy</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={difficulty?.Easy}
                      onChange={(e) =>
                        handleChange("Easy", parseInt(e.target.value, 10))
                      }
                      min={levelRanges.easy.min}
                      max={levelRanges.easy.max}
                      className="border rounded p-1 w-20"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Medium</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={difficulty?.Medium}
                      onChange={(e) =>
                        handleChange("Medium", parseInt(e.target.value, 10))
                      }
                      min={levelRanges.medium.min}
                      max={levelRanges.medium.max}
                      className="border rounded p-1 w-20"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Hard</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={difficulty?.Hard}
                      onChange={(e) =>
                        handleChange("Hard", parseInt(e.target.value, 10))
                      }
                      min={levelRanges.hard.min}
                      max={levelRanges.hard.max}
                      className="border rounded p-1 w-20"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Include</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={difficulty?.Include}
                      onChange={(e) =>
                        handleChange("Include", parseInt(e.target.value, 10))
                      }
                      min={levelRanges.include.min}
                      max={levelRanges.include.max}
                      className="border rounded p-1 w-20"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 ptr text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
          <div className="w-full border my-10 border-gray-300"></div>
        </>
      )}

      {/* General Settings */}
      <GeneralSettings />

      {/* Floating Toast Message */}
      {showToast && (
        <Toast message={message} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default DSettings;
