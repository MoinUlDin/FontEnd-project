import React, { useState } from "react";
import InputField from "../components/childrens/InputField";

function CreateTemplateModal({ onClose, onSubmit }) {
  const bgColor = "bg-white";
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Template name is required");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg min-h-90 p-6 z-10 min-w-[500px]">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-300">
          Create Template
        </h2>
        <form
          className="flex flex-col justify-center items-center"
          onSubmit={handleFormSubmit}
        >
          <div className="mt-5">
            <InputField
              ctype="text"
              id="templateName"
              clable="Template Name"
              css1={bgColor}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mt-5">
            <textarea
              className="min-w-input-width border-2 border-gray-300 rounded-md px-4 text-sm focus:border-blue-500 focus:outline-none"
              name="description"
              id="templateDescription"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 hover:cursor-pointer text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTemplateModal;
