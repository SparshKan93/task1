import React from "react";

const Input = ({ type = "text", className = "", ...props }) => (
  <input
    type={type}
    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    {...props}
  />
);

export default Input;
