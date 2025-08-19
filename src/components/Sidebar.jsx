import React from "react";
import { NavLink } from "react-router-dom";
import {
  LuBookPlus,
  LuSignpost,
  LuChartBar,
  LuUser,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";
import { FaHome } from "react-icons/fa";

function Sidebar() {
  const linkClass =
    "flex items-center gap-3 font-medium px-3 py-2 rounded-md transition-colors";

  return (
    <div className="h-full bg-black text-white flex flex-col p-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center">
        <img
          className="h-20 w-20 rounded-full border-2 border-gray-600"
          src="https://static.vecteezy.com/system/resources/previews/002/002/403/large_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
          alt="user"
        />
        <h2 className="text-lg font-bold mt-2">Admin</h2>
        <p className="text-gray-400 text-sm">admin@example.com</p>
      </div>

      {/* Navigation */}
      <nav className="mt-10 flex flex-col gap-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive ? "bg-[#ffe6c9] text-black" : "hover:text-[#ffe6c9]"
            }`
          }
        >
          <FaHome size={18} /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/add-driver"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive ? "bg-[#ffe6c9] text-black" : "hover:text-[#ffe6c9]"
            }`
          }
        >
          <LuBookPlus size={18} /> Add Driver/Manager
        </NavLink>

        <NavLink
          to="/posts"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive ? "bg-[#ffe6c9] text-black" : "hover:text-[#ffe6c9]"
            }`
          }
        >
          <LuSignpost size={18} /> View Posts
        </NavLink>

        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive ? "bg-[#ffe6c9] text-black" : "hover:text-[#ffe6c9]"
            }`
          }
        >
          <LuChartBar size={18} /> Summary
        </NavLink>

        <NavLink
          to="/accounts"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive ? "bg-[#ffe6c9] text-black" : "hover:text-[#ffe6c9]"
            }`
          }
        >
          <LuUser size={18} /> Accounts
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive ? "bg-[#ffe6c9] text-black" : "hover:text-[#ffe6c9]"
            }`
          }
        >
          <LuSettings size={18} /> Settings
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <NavLink
          to="/logout"
          className="flex items-center gap-3 text-red-500 hover:text-red-400"
        >
          <LuLogOut size={18} /> Logout
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
