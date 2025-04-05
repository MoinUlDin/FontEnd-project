import React, { useState, useEffect, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CompanyForm from "../Forms/CompanyForm";
import apiClient from "../../services/apiClient";

function CompanyListItem({ id, name, credits, owner, email, fn, showToast }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [loading, setLoading] = useState(false);

  // Create a ref for the dropdown container
  const dropdownRef = useRef(null);

  // Attach an event listener to close the dropdown on outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openModalForAction = (action) => {
    setModalAction(action);
    setModalOpen(true);
    setDropdownOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = async (action, value) => {
    try {
      setLoading(true);
      let payload = {};
      if (action === "changeName") {
        payload = { name: value };
      } else if (action === "addCredits") {
        payload = { credits: value };
      }
      // Make the PATCH request using the company id.
      const response = await apiClient.patch(`company/${id}/`, payload);
      fn(); // call parent's fetch function to update the list
      showToast(true);
    } catch (error) {
      console.error("Error updating company:", error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <>
      <div
        key={id}
        className="grid grid-cols-9 px-4 md:px-6 space-y-5 relative"
      >
        {loading && <div className="bg-black inset-0 fixed opacity-90"></div>}
        <p className="col-span-3">{name}</p>
        <div className="col-span-3 flex flex-col">
          <h2 className="capitalize text-lg font-semibold text-gray-700">
            {owner}
          </h2>
          <span className="text-12">{email}</span>
        </div>
        <p className="place-self-center">{credits}</p>
        {/* Actions */}
        <div
          ref={dropdownRef}
          className="place-self-center col-span-2 relative"
        >
          <button
            onClick={toggleDropdown}
            className="bg-amber-600 ptr text-white py-1 px-2 rounded flex items-center gap-1"
          >
            Actions{" "}
            <ExpandMoreIcon
              className={`${
                dropdownOpen ? "rotate-180" : ""
              } transition-transform duration-200`}
            />
          </button>
          {dropdownOpen && (
            <ul className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-300 shadow-md rounded z-10">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => openModalForAction("changeName")}
              >
                Change Name
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => openModalForAction("addCredits")}
              >
                Update Credits
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Delete
              </li>
            </ul>
          )}
        </div>
      </div>
      <CompanyForm
        open={modalOpen}
        action={modalAction}
        companyName={name}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />
    </>
  );
}

export default CompanyListItem;
