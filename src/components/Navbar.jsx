import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="flex justify-between items-center py-3 px-6 bg-white shadow-md sticky top-0 z-50">
      <div className="px-4 py-2">
        <h1 className="text-lg font-semibold">Fleet Management</h1>
      </div>
      <nav className="flex space-x-5">
        <Link to="/" className="text-gray-600 hover:text-gray-800">
          Home
        </Link>
        <Link to="/about" className="text-gray-600 hover:text-gray-800">
          About
        </Link>
        <Link to="/contact" className="text-gray-600 hover:text-gray-800">
          Contact
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          <Link to="/login" className="text-gray-600 hover:text-gray-800">
            Login
          </Link>
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          <Link to="/register" className="text-gray-600 hover:text-gray-800">
            Register
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
