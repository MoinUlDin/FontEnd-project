// src/components/FullScreenPrompt.jsx
import React from "react";

const FullScreenPrompt = ({ onAllow }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="bg-white rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Full Screen Mode Required</h2>
        <p className="text-gray-700 mb-6">
          For the best testing experience, please allow full screen mode. This
          will hide your browser’s normal controls. Please allow to proceed.
        </p>
        <button
          className="bg-blue-600 ptr text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={onAllow}
        >
          Allow Full Screen
        </button>
      </div>
    </div>
  );
};

export default FullScreenPrompt;
