import React from 'react';

/**
 * A custom quantity input with + and - buttons.
 * @param {object} props
 * @param {number} props.value - The current quantity value.
 * @param {function(number): void} props.onChange - Callback when the value changes.
 * @param {number} [props.min=1] - The minimum allowed value.
 * @param {number} [props.max=99] - The maximum allowed value.
 */
export default function QuantityInput({ value, onChange, min = 1, max = 99 }) {
  const handleIncrement = () => {
    const newValue = Math.min(value + 1, max);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - 1, min);
    onChange(newValue);
  };

  const handleChange = (e) => {
    const num = parseInt(e.target.value, 10);
    if (isNaN(num)) {
      onChange(min);
    } else {
      onChange(Math.max(min, Math.min(num, max)));
    }
  };

  return (
    <div className="flex items-center border rounded-md bg-white">
      <button onClick={handleDecrement} className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-l-md" aria-label="Decrease quantity">-</button>
      <input type="text" value={value} onChange={handleChange} className="w-12 text-center border-l border-r focus:outline-none" />
      <button onClick={handleIncrement} className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-r-md" aria-label="Increase quantity">+</button>
    </div>
  );
}
