// src/components/TestSummaryPage.jsx
import React, { useState, useEffect } from "react";
import { Tab, Tabs, Box } from "@mui/material";
import apiClient from "../services/apiClient";
import OverallSummaryTable from "../components/OverallSummaryTable";
import HighPerformanceTable from "../components/HighPerformanceTable";
import { ImSpinner8 } from "react-icons/im";

const TestSummaryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [overallData, setOverallData] = useState([]);
  const [highPerformanceData, setHighPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    apiClient
      .get("/tests/summary/")
      .then((response) => {
        // Expecting response.data to be an object with two keys.
        setOverallData(response.data.over_all_summary || []);
        setHighPerformanceData(response.data.high_performance || []);
      })
      .catch((error) => {
        console.error("Error fetching test summary:", error);
        setApiError(error.response?.data?.message || error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <ImSpinner8 className="animate-spin mr-2" />
        <span>Loading summary...</span>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="text-center text-red-500 py-10">
        <h2>Error: {apiError}</h2>
      </div>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        size="small"
        sx={{
          ".MuiTab-root": {
            fontSize: "1rem", // Default font size
            "@media (max-width:600px)": {
              fontSize: "0.8rem", // Smaller font size on mobile
            },
            "@media (max-width:400px)": {
              fontSize: "0.5rem", // Smaller font size on mobile
            },
          },
        }}
      >
        <Tab label="Overall Summary" />
        <Tab label="High Performance" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <OverallSummaryTable data={overallData} />}
        {activeTab === 1 && <HighPerformanceTable data={highPerformanceData} />}
      </Box>
    </Box>
  );
};

export default TestSummaryPage;
