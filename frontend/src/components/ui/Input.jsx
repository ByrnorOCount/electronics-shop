import React from "react";

export default function Input({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <input
        {...props}
        className="mt-1 block w-full border rounded px-3 py-2"
      />
    </label>
  );
}
