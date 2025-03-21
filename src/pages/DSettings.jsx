// src/components/DSettings.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient"; // Axios instance
import { ImSpinner10 } from "react-icons/im";
import { useSelector } from "react-redux";
import { Autocomplete, TextField } from "@mui/material";

function DSettings() {
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [showLevelSettings, setShowLevelSettings] = useState(false);

  // State for preferred difficulty
  const difficultyOptions = ["Easy", "Medium", "Hard", "Include"];
  const [preferredDifficulty, setPreferredDifficulty] = useState("");

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
    setLoading(true);
    apiClient
      .get("/tests/difficulty_levels/")
      .then((response) => {
        // Assuming response.data is an array of level objects
        setDifficultyLevels(response.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching difficulty levels");
      })
      .finally(() => setLoading(false));
  }, []);

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
    setDifficultyLevels((prevLevels) =>
      prevLevels.map((item) =>
        item.level === level ? { ...item, number_of_questions: newValue } : item
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
      })
      .catch((err) => {
        console.error(err);
        setError(
          err.response?.data?.message || "Error updating difficulty levels"
        );
      })
      .finally(() => setSaving(false));
  };

  // Handle change for the Autocomplete preferred difficulty
  const handlePreferredChange = (event, newValue) => {
    setPreferredDifficulty(newValue);
    // Save the object in localStorage: { email, difficulty }
    if (user?.email && newValue) {
      const prefObj = { email: user.email, difficulty: newValue };
      localStorage.setItem("userPreferredDifficulty", JSON.stringify(prefObj));
    }
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
                {difficultyLevels.map((levelObj) => (
                  <tr key={levelObj.level} className="border-b">
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
                        className="border rounded p-1 w-20"
                      />
                    </td>
                  </tr>
                ))}
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
        </>
      )}

      <div className="w-full border my-10 border-gray-300"></div>
      {/* Preferred Difficulty using Autocomplete */}
      <div className="mt-8">
        <h1 className="text-2xl font-bold mb-4">Default Difficulty Level</h1>
        <div className="mt-10 max-w-2xl">
          <Autocomplete
            options={difficultyOptions}
            value={preferredDifficulty}
            size="small"
            onChange={handlePreferredChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Preferred Difficulty"
                variant="outlined"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default DSettings;
