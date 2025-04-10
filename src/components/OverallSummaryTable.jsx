// src/components/OverallSummaryTable.jsx
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { LinearProgress } from "@mui/material";

const OverallSummaryTable = ({ data }) => {
  // Format rows similar to your previous implementation.
  const formattedRows = data.map((item, index) => ({
    id: index,
    template: item.template,
    job_role: item.job_role,
    total_tests: item.total_tests,
    pending: item.pending,
    invited: item.invited,
    rejected: item.rejected,
    shortlisted: item.shortlisted,
    hired: item.hired,
    total_failed: item.total_failed,
    failed:
      item.failed && item.failed.length > 0
        ? item.failed
            .map((f) => `${f.status_reason}: ${f.number_of_candidates}`)
            .join(", ")
        : "None",
  }));

  const renderProgressCell = (params, fieldLabel) => {
    const value = params?.row?.[fieldLabel];
    const total = params?.row?.total_tests;
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
      <div className="w-full flex flex-col items-center">
        <div className="mb-1">
          <span className="font-bold text-blue-800">{value}</span>{" "}
          <span className="text-[10px] text-gray-600">({percent}%)</span>
        </div>
        <div className="w-full">
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#7d7d7d",
              "& .MuiLinearProgress-bar": { backgroundColor: "green" },
            }}
          />
        </div>
      </div>
    );
  };

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
      field: "job_role", // this fields is hidden only using for filter
      headerName: "Job Role",
      flex: 1,
      hide: true,
      minWidth: 110,
      renderCell: (params) => <span>{params?.row?.job_role || "-"}</span>,
    },
    {
      field: "total_tests",
      headerName: "Total",
      flex: 1,
      minWidth: 30,
      renderCell: (params) => {
        const value = params?.row?.total_tests;
        return <span>{value === 0 ? "-" : value}</span>;
      },
    },
    {
      field: "pending",
      headerName: "Pending",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => renderProgressCell(params, "pending"),
    },
    {
      field: "rejected",
      headerName: "Rejected",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => renderProgressCell(params, "rejected"),
    },
    {
      field: "shortlisted",
      headerName: "Shortlisted",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => renderProgressCell(params, "shortlisted"),
    },
    {
      field: "hired",
      headerName: "Hired",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => renderProgressCell(params, "hired"),
    },
    {
      field: "total_failed",
      headerName: "Total Failed",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => renderProgressCell(params, "total_failed"),
    },
    {
      field: "failed",
      headerName: "Failed Details",
      flex: 2,
      minWidth: 120,
      renderCell: (params) => {
        const value = params?.row?.failed;
        const list = value.split(",");
        return (
          <div className="text-[12px]">
            <div className="space-y-1">
              {list.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    item.includes("Cheating") ? "text-red-800" : ""
                  }`}
                >
                  {item.trim()}
                </div>
              ))}
            </div>
          </div>
        );
      },
    },
  ];
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    job_role: false,
  });

  const handleColumnVisibilityChange = (newModel) => {
    setColumnVisibilityModel(newModel);
  };
  return (
    <div className="h-[600px] w-full">
      <DataGrid
        rows={formattedRows}
        columns={columns}
        pageSize={10}
        rowHeight={80}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={handleColumnVisibilityChange}
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

export default OverallSummaryTable;
