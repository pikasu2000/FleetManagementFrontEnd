import React from "react";

function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
}) {
  // Common base style
  const baseStyle =
    "rounded-xl font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant styles
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105 focus:ring-purple-400",
    secondary:
      "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 focus:ring-blue-300",
    success:
      "bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 focus:ring-green-400",
    warning:
      "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 focus:ring-yellow-300",
    danger:
      "bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 focus:ring-red-400",
    outline:
      "border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 focus:ring-gray-300",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  };

  // Size styles
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-7 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}

export default Button;
