import React, { useState, useEffect } from "react";
import sideimg from "../assets/report.avif";
import { FiX } from "react-icons/fi";
import { TextField } from "@mui/material";

function CreateTemplateModal({ onClose, onSubmit }) {
  const [errorMessage, setErrorMessage] = useState("");
  // Initially, set is_predefined to true.
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_predefined: false,
  });
  // State to control the visibility of the checkbox.
  const [showCheckbox, setShowCheckbox] = useState(false);

  useEffect(() => {
    // Attempt to retrieve user data from local storage
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        // Show the checkbox only if the role is ADMIN or SUPER_ADMIN
        if (userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") {
          setShowCheckbox(true);
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage", error);
      }
    }
  }, [showCheckbox]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    // Optionally clear error message when user types valid input
    if (name === "name" && value.trim()) {
      setErrorMessage("");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("Template name is required");
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
      <div className="relative border-2 border-amber-800 bg-white rounded-2xl overflow-hidden md:min-h-90 z-10 md:min-w-[500px] max-w-[70%]">
        <div className="text-xl flex px-3 md:px-5 justify-between font-bold bg-black py-4 text-white">
          <h2>Create Template</h2>
          <div onClick={onClose} className="hover:cursor-pointer p-1">
            <FiX className="text-2xl transition-all duration-300 font-extrabold hover:text-red-600" />
          </div>
        </div>
        <form
          className="grid grid-cols-1 md:grid-cols-8 h-auto md:h-[320px]"
          onSubmit={handleFormSubmit}
        >
          <div className="hidden md:flex h-full items-end justify-center col-span-3 bg-[#ebe5a7] md:min-w-22">
            <img src={sideimg} alt="Side visual" />
          </div>
          <div className="col-span-1 md:col-span-5 flex flex-col justify-center items-end px-4">
            <div className="mt-5 w-full">
              <TextField
                fullWidth
                id="templateName"
                label="Template Name"
                variant="outlined"
                size="small"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errorMessage)}
                helperText={errorMessage}
              />
            </div>
            <div className="mt-5 w-full">
              <textarea
                className="md:min-w-input-width min-h-[5rem] py-2 max-h-[125px] border-2 border-gray-300 rounded-md px-4 text-sm focus:border-blue-500 focus:outline-none w-full"
                name="description"
                id="templateDescription"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            {showCheckbox && (
              <div className="mt-5 w-full flex items-center">
                <input
                  type="checkbox"
                  id="is_predefined"
                  name="is_predefined"
                  checked={formData.is_predefined}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="is_predefined" className="text-sm font-medium">
                  Predefined Template
                </label>
              </div>
            )}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={false}
                className="bg-sunglow mb-4 hover:bg-blue-700 hover:cursor-pointer text-white px-4 py-2 rounded-lg mr-2"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTemplateModal;
