import React, { useState, useEffect, useRef } from "react";

const EditableField = ({ label, value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleSave = () => {
    setEditing(false);
    onSave(currentValue);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setEditing(false);
  };

  return (
    <div className="flex max-w-[70%] p-3">
      <label className="mr-5">{label}:</label>
      {editing ? (
        <div className="flex grow justify-between">
          <input
            ref={inputRef}
            className="outline-0 focus:border-b focus:border-blue-600 mx-3"
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              className="ptr hover:bg-gray-200 px-3 py-2 rounded-lg"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="ptr hover:bg-gray-200 px-3 py-2 rounded-lg"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex grow justify-between">
          <span>{value}</span>
          <button
            className="ptr hover:bg-gray-200 px-3 py-2 rounded-lg"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField;
