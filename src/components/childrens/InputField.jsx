import React, { useState, useEffect, useRef, forwardRef } from "react";

const InputField = forwardRef((props, ref) => {
  const {
    ctype = "text",
    clable = "Input Field",
    id = 0,
    css = "min-w-input-width h-10 md:mb-4",
    css1 = "",
    required = "*",
    onChange,
    ...rest
  } = props;

  const [isFilled, setIsFilled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = ref || useRef(null); // use forwarded ref if provided

  const handleInputChange = (e) => {
    setIsFilled(e.target.value !== "");
    if (onChange) {
      onChange(e);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  useEffect(() => {
    // Using a timeout helps ensure that autofill has completed.
    // TODO: Fix floating label issue.
    setTimeout(() => {
      if (inputRef.current) {
        console.log("we are inside");
        inputRef.current.focus();
      }
    }, 100);
  }, [inputRef]);

  return (
    <div className={`relative ${css} w-68 h-10 md:mb-4 mb-2`}>
      <input
        ref={inputRef}
        type={ctype}
        id={id}
        name={id} // Ensure a name attribute is provided for react-hook-form
        placeholder=" "
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="peer w-full h-full border-2 border-gray-300 rounded-md px-4 text-sm focus:border-blue-500 focus:outline-none"
        {...rest}
      />
      <label
        htmlFor={id}
        className={`absolute z-10 left-4 text-gray-500 text-sm transition-all duration-300 rounded p-1 hover:cursor-text ${
          isFocused || isFilled
            ? `-top-5 text-sm text-blue-500 ${css1}`
            : "top-0 text-[16px] font-semibold text-gray-400"
        }`}
      >
        {clable} {required}
      </label>
    </div>
  );
});

export default InputField;
