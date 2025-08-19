import React from "react";

function Card({ title, num, className }) {
  return (
    <div
      className={`bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition ${className}`}
    >
      <h3 className="font-semibold text-gray-600">{title}</h3>
      <h1 className="mt-3 text-4xl font-bold text-gray-900">{num}</h1>
    </div>
  );
}

export default Card;
