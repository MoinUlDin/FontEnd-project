import React from "react";

const WarningDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-black opacity-50"
      ></div>
      {/* Modal container */}
      <div className="relative bg-white rounded-lg p-6 z-10 shadow-lg">
        <p className="mb-4 text-lg">
          {message ||
            "Are you sure you want to delete? This action is permanent."}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(true);
              onCancel();
            }}
            className="px-4 py-2 bg-red-500 ptr text-white rounded hover:bg-red-600"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningDialog;
