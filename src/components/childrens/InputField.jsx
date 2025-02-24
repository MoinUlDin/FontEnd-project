import { useState, useEffect, useRef } from "react";

function InputField({
  ctype = "text",
  clable = "Input Field",
  id = 0,
  css = "w-68 h-10 md:mb-4",
  css1 = "",
  required = "*",
  onChange,
}) {
  const [isFilled, setIsFilled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null); // Create a ref for the input

  const handleInputChange = (e) => {
    setIsFilled(e.target.value !== "");
    if (onChange) {
      onChange(e);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  useEffect(() => {
    // Using a timeout helps ensure that autofill has completed
    //  TODO fix floting label issue
    setTimeout(() => {
      console.log("we are inside");
      inputRef.current.focus();
    }, 100);
  }, []);

  return (
    <div className={`relative ${css} w-68 h-10 md:mb-4 mb-2`}>
      <input
        ref={inputRef} // Attach the ref to the input element
        type={ctype}
        id={id}
        placeholder=" "
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="peer w-full h-full border-2 border-gray-300 rounded-md px-4 text-lg focus:border-blue-500 focus:outline-none"
      />
      <label
        htmlFor={id}
        className={`absolute z-10 left-4 text-gray-500 text-sm transition-all duration-300 rounded 
          p-2 hover:cursor-text ${
            isFocused || isFilled
              ? `-top-5 text-sm text-blue-500 ${css1}` // When focused or filled
              : "top-0 text-[16px] font-semibold text-gray-400"
          }`}
      >
        {clable} {required}
      </label>
    </div>
  );
}

export default InputField;
