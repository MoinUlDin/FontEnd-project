import React, { useState } from "react";
import InputField from "../components/childrens/InputField";
import sideimg from "../assets/report.avif";

function CreateTemplateModal({ onClose, onSubmit }) {
  const bgColor = "bg-white";
  const [errorMessage, setErrorMessage] = useState("");
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
      <div className="relative border-2 border-amber-800 bg-white rounded-2xl overflow-hidden min-h-90 z-10 min-w-[500px]">
        <div className="text-xl  flex px-3 md:px-5 justify-between font-bold bg-black py-4 text-white ">
          <h2 className="">Create Template</h2>
          <span onClick={onClose} className="hover:cursor-pointer p-1">
            ❌
          </span>
        </div>
        <form
          className="grid grid-cols-8 h-[320px]"
          onSubmit={handleFormSubmit}
        >
          <div className="h-full flex items-end justify-center col-span-3 bg-[#ebe5a7] min-w-22">
            <img src={sideimg} alt="" />
          </div>
          <div className="col-span-5 flex flex-col justify-center items-end px-4 ">
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
              {errorMessage && (
                <p className="text-red-500 text-xs -mt-3">{errorMessage}</p>
              )}
            </div>
            <div className="mt-5">
              <textarea
                className="min-w-input-width min-h-[5rem] py-2 max-h-[125px] border-2 border-gray-300 rounded-md px-4 text-sm focus:border-blue-500 focus:outline-none"
                name="description"
                id="templateDescription"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
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
