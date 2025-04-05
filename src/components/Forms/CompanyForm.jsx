// CompanyForm.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TextField, Button } from "@mui/material";

const CompanyForm = ({ action, companyName, open, onClose, onSubmit }) => {
  const [value, setValue] = useState("");

  // Clear the form value whenever the modal is opened
  useEffect(() => {
    if (open) {
      setValue("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the action type and input value to the parent handler
    onSubmit(action, value);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Backdrop with lighter opacity */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the form from closing it
        className="bg-white rounded-lg p-6 w-96 shadow-lg z-10"
      >
        <h2 className="text-xl font-bold mb-4 space-x-2">
          <span>Edit</span> <span className="text-gray-600">{companyName}</span>{" "}
        </h2>
        {action === "changeName" && (
          <TextField
            label="New Company Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
        {action === "addCredits" && (
          <TextField
            label="Number of Credits"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

CompanyForm.propTypes = {
  action: PropTypes.string.isRequired, // e.g. "changeName" or "addCredits"
  companyName: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CompanyForm;
