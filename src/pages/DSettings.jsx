// src/components/DSettings.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient"; // Axios instance
import { ImSpinner10 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, TextField } from "@mui/material";
import { setDifficultyLevels } from "../features/assessmentSlice";
import GeneralSettings from "../components/GeneralSettings";
import Toast from "../components/childrens/FloatingMessage";

function DSettings() {
  const dispatch = useDispatch();
  const difficultyLevels = useSelector(
    (state) => state.assessment.difficultyLevels
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [showLevelSettings, setShowLevelSettings] = useState(false);

  // Define the restrictions for each difficulty level.
  const levelRanges = {
    easy: { min: 4, max: 12 },
    medium: { min: 12, max: 25 },
    hard: { min: 18, max: 50 },
    include: { min: 60, max: 100 },
  };

  // Show level settings only if user is ADMIN or SUPER_ADMIN
  useEffect(() => {
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
      setShowLevelSettings(true);
    } else {
      setShowLevelSettings(false);
    }
  }, [user]);

  // Fetch the difficulty levels when the component mounts.
  useEffect(() => {
    if (difficultyLevels.length === 0) {
      setLoading(true);
      apiClient
        .get("/tests/difficulty_levels/")
        .then((response) => {
          dispatch(setDifficultyLevels(response.data));
        })
        .catch((err) => {
          console.error("Error fetching difficulty levels:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, difficultyLevels]);

  // Load preferred difficulty from localStorage for the current user
  useEffect(() => {
    if (user?.email) {
      const storedPref = localStorage.getItem("userPreferredDifficulty");
      if (storedPref) {
        try {
          const parsed = JSON.parse(storedPref);
          if (parsed.email === user.email) {
            setPreferredDifficulty(parsed.difficulty);
          }
        } catch (e) {
          console.error("Error parsing stored preferred difficulty", e);
        }
      }
    }
  }, [user]);

  // Handler for when an input value changes in the table.
  const handleChange = (level, newValue) => {
    // Get the appropriate range for the level (using lower case)
    const range = levelRanges[level.toLowerCase()];
    if (range) {
      // Clamp the value if it is outside the allowed range.
      if (newValue < range.min) {
        newValue = range.min;
      }
      if (newValue > range.max) {
        newValue = range.max;
      }
    }
    // Update state with new value
    dispatch(
      setDifficultyLevels(
        difficultyLevels.map((item) =>
          item.level === level
            ? { ...item, number_of_questions: newValue }
            : item
        )
      )
    );
  };

  // Submit the updated difficulty levels
  const handleSubmitLevels = (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    apiClient
      .post("/tests/difficulty_levels/", difficultyLevels)
      .then((response) => {
        setMessage(
          response.data.message || "Difficulty levels updated successfully."
        );
        setShowToast(true);
      })
      .catch((err) => {
        console.error(err);
        setMessage(
          err.response?.data?.message || "Error updating difficulty levels"
        );
      })
      .finally(() => {
        setSaving(false);
        setShowToast(true);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <ImSpinner10 className="animate-spin mr-2" />
        <span>Loading difficulty levels...</span>
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
                {difficultyLevels.map((levelObj) => {
                  // Get restrictions for this level if available
                  const range = levelRanges[levelObj.level.toLowerCase()] || {};
                  return (
                    <tr
                      key={levelObj.level}
                      className="border-b border-gray-300"
                    >
                      <td className="px-4 py-2">{levelObj.level}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={levelObj.number_of_questions}
                          onChange={(e) =>
                            handleChange(
                              levelObj.level,
                              parseInt(e.target.value, 10)
                            )
                          }
                          min={range.min}
                          max={range.max}
                          className="border rounded p-1 w-20"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
          <div className="w-full border my-10 border-gray-300"></div>
        </>
      )}

      {/* General Settins */}
      <GeneralSettings />

      {/* floating Message with Toast */}
      {showToast && (
        <Toast message={message} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default DSettings;
