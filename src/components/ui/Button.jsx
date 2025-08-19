import React from "react";

function Button({ children, onClick, variant = "primary" }) {
  const baseStyle =
    "px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 focus:ring-purple-400",
    secondary:
      "bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 focus:ring-cyan-400",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      {children}
    </button>
  );
}

export default Button;
