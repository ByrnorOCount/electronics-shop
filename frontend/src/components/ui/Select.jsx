import React, { useState, useRef, useEffect } from "react";
import Icon from "./Icon";

/**
 * A reusable, custom-styled select dropdown component.
 * A reusable select dropdown component with a label.
 *
 * @param {object} props
 * @param {string} props.label - The label text for the select input.
 * @param {string} props.name - The name attribute for the select element.
 * @param {string | number} props.value - The current value of the select.
 * @param {Function} props.onChange - The function to call when the value changes.
 * @param {Array<{value: string | number, label: string}>} props.options - The options for the dropdown.
 * @param {string} [props.placeholder] - The placeholder text for the default option.
 * @param {boolean} [props.required=false] - Whether the select is required.
 * @param {string} [props.className=""] - Additional classes for the wrapper div.
 * @returns {JSX.Element}
 */
const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find((option) => option.value == value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue) => {
    // Simulate the event object that a native select would provide
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const handlePlaceholderClick = () => {
    // Clear the selection but keep the dropdown open.
    onChange({ target: { name, value: "" } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`relative ${className}`}
      ref={selectRef}
      onKeyDown={handleKeyDown}
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <button
          type="button"
          id={name}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <Icon
              name={isOpen ? "chevron-down" : "chevron-right"}
              className="h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
            <ul
              tabIndex="-1"
              role="listbox"
              className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            >
              {placeholder && (
                <li
                  onClick={handlePlaceholderClick}
                  className="cursor-default select-none relative py-2 px-4 bg-gray-50"
                >
                  <span className="font-semibold block truncate text-gray-500">
                    {placeholder}
                  </span>
                </li>
              )}
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className="group text-gray-900 cursor-default select-none relative py-2 pl-10 pr-4 hover:bg-indigo-600 hover:text-white"
                  role="option"
                  aria-selected={value === option.value}
                >
                  <span
                    className={`${
                      value === option.value ? "font-semibold" : "font-normal"
                    } block truncate`}
                  >
                    {option.label}
                  </span>
                  {value === option.value ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600 group-hover:text-white">
                      <Icon name="check" className="h-5 w-5" />
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
