import React, { useState, useMemo, useRef, useEffect } from "react";

function FilterBy({ id = "", list = [], css = "" }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const maxw = "max-w-50";
  const containerRef = useRef(null);

  // useMemo to filter options based on inputValue and list
  const filteredOptions = useMemo(() => {
    if (inputValue.trim() !== "") {
      return list.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return list;
  }, [inputValue, list]);

  // Close dropdown if click is outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    setIsFocused(true);
    setDropdownOpen(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay closing so that a click on dropdown items is captured
    setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const handleLabelClick = () => {
    // Toggle dropdown if label is clicked
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className={`relative ${css}`} ref={containerRef}>
      <div
        className={`flex items-center bg-white justify-between px-3 border min-h-9 ${maxw} rounded-3xl ${
          isFocused || dropdownOpen ? "border-blue-600" : "border-gray-300"
        }`}
      >
        <input
          className="max-w-[65%] text-12 outline-0"
          type="text"
          id={id}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <label
          htmlFor={id}
          className="text-[9px] max-w-[40%] hover:cursor-pointer"
          onClick={handleLabelClick}
        >
          Search By <span>▼</span>
        </label>
      </div>
      {dropdownOpen && filteredOptions.length > 0 && (
        <ul
          className={`absolute z-10 left-4 bg-white border shadow-xl shadow-gray-300 rounded min-w-[8rem] border-gray-300 mt-1 ${maxw}`}
        >
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="px-3 py-1 border-b border-b-gray-200 rounded hover:bg-blue-100 hover:cursor-pointer text-[10px]"
              onMouseDown={() => {
                // onMouseDown prevents input blur before selection
                setInputValue(option);
                setDropdownOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterBy;
