import React from "react";

export default function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={`px-4 py-2 border rounded-lg w-full focus:outline-none ${className}`}
    />
  );
}
