// src/components/HighPerformanceTable.jsx
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { LinearProgress } from "@mui/material";

const HighPerformanceTable = ({ data }) => {
  // Map the data for the high performance table.
  // Expecting each item to include: template, job_role, total_tests, min_final_score, max_final_score, avg_final_score.
  const formattedRows = data.map((item, index) => ({
    id: index,
    template: item.template,
    job_role: item.job_role,
    total_tests: item.total_tests,
    min: item.min_final_score,
    max: item.max_final_score,
    avg: item.avg_final_score,
  }));

  const columns = [
    {
      field: "template",
      headerName: "Template",
      flex: 1,
      minWidth: 170,
      valueGetter: (template) => {
        return `${template || ""}`.trim();
      },
      renderCell: (params) => (
        <div className="text-sm flex flex-col gap-2">
          <span className="text-blue-900 font-semibold">
            {params?.row?.template || "-"}
          </span>
          <span className="text-12 text-gray-700">
            {params?.row?.job_role || "-"}
          </span>
        </div>
      ),
    },
    {
      field: "job_role",
      headerName: "Job Role",
      flex: 1,
      renderCell: (params) => <span>{params.row.job_role || "-"}</span>,
    },
    {
      field: "total_tests",
      headerName: "Total Tests",
      flex: 1,
      renderCell: (params) => <span>{params.row.total_tests || "-"}</span>,
    },
    {
      field: "min",
      headerName: "Min Final Score",
      flex: 1,
      renderCell: (params) =>
        params.row.min !== null ? `${params.row.min}%` : "-",
    },
    {
      field: "max",
      headerName: "Max Final Score",
      flex: 1,
      renderCell: (params) =>
        params.row.max !== null ? `${params.row.max}%` : "-",
    },
    {
      field: "avg",
      headerName: "Avg Final Score",
      flex: 1,
      renderCell: (params) =>
        params.row.avg !== null ? `${params.row.avg.toFixed(1)}%` : "-",
    },
  ];

  return (
    <div className="h-[600px] w-full">
      <DataGrid
        rows={formattedRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        rowHeight={80}
        columnVisibilityModel={{
          // hiding columns
          job_role: false,
        }}
        sx={{
          border: "none",
          ".MuiDataGrid-cell": {
            borderBottom: "1px solid #e0f0e0",
            whiteSpace: "normal",
            lineHeight: "1.4",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "600",
          },
        }}
      />
    </div>
  );
};

export default HighPerformanceTable;
