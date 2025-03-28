import React, { useState, useEffect, useRef } from "react";
import Logo from "../childrens/Logo";
import Title from "../childrens/Title";
import { TextField } from "@mui/material";
import { ImSpinner8 } from "react-icons/im";
import UserService from "../../services/userServices"; // Ensure this service calls "users/profile/update/"

function ProfileUpdatePopup({ onClose }) {
  const firstNameRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Focus on first name field when popup opens.
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  // Handle input changes.
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Since everything is optional, check that at least one field is provided.
    if (!formData.username && !formData.first_name && !formData.last_name) {
      setError("Please update at least one field.");
      return;
    }
    setIsLoading(true);
    try {
      // Call the update endpoint in UserService.
      await UserService.updateProfile(formData);
      // Close popup on success.
      onClose();
    } catch (err) {
      setError(err.message || "Error updating profile.");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 drop-shadow-2xl shadow-black">
      <div className="absolute inset-0 bg-black opacity-60 -z-1"></div>
      <form
        onSubmit={handleSubmit}
        className="shadow-2xl bg-white max-w-[640px] border-2 rounded-xl md:rounded-3xl p-2 md:p-6 border-amber-700 min-h-[455px] flex flex-col items-center"
      >
        <Logo />
        <Title css="mt-2">Personal Info</Title>
        <TextField
          id="username"
          label="Username"
          type="text"
          className="w-80"
          onChange={handleChange}
          size="small"
          margin="normal"
        />
        <TextField
          id="first_name"
          label="First Name"
          type="text"
          className="w-80"
          onChange={handleChange}
          size="small"
          margin="normal"
          inputRef={firstNameRef}
        />
        <TextField
          id="last_name"
          label="Last Name"
          type="text"
          className="w-80"
          onChange={handleChange}
          size="small"
          margin="normal"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="uppercase hover:cursor-pointer py-2 md:py-3 bg-blue-600 text-white rounded-xl px-8 md:px-18 mt-2 md:mt-6 hover:-translate-y-1.5 transition-all duration-500"
        >
          {isLoading ? (
            <span className="flex ptr items-center gap-2">
              <ImSpinner8 className="animate-spin" />
              <span>Updating...</span>
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}

export default ProfileUpdatePopup;
