import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuBookPlus,
  LuSignpost,
  LuChartBar,
  LuUser,
  LuSettings,
  LuLogOut,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import toast from "react-hot-toast";

function Sidebar({ isOpen, setIsOpen }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logouthandle = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logout Successfully");
    navigate("/login");
  };

  const linkClass =
    "flex items-center gap-3 font-medium px-4 py-2 rounded-xl transition-all duration-300";

  return (
    <div
      className={`h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white flex flex-col shadow-2xl transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Profile Section (Fixed at top) */}
      <div className="flex flex-col items-center text-center p-4 border-b border-gray-700 relative">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 right-3 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition"
        >
          {isOpen ? <LuChevronLeft /> : <LuChevronRight />}
        </button>

        <img
          className="h-14 w-14 rounded-full border-2 border-[#ffe6c9] shadow-lg"
          src="https://static.vecteezy.com/system/resources/previews/002/002/403/large_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
          alt="user"
        />
        {isOpen && (
          <>
            <h2 className="text-lg font-bold mt-2">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </>
        )}
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto mt-4 px-2 custom-scrollbar space-y-6">
        {/* --- Dashboard --- */}
        <div>
          {isOpen && (
            <p className="text-gray-400 uppercase text-xs px-4 mb-2">Main</p>
          )}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <FaHome size={18} /> {isOpen && "Dashboard"}
          </NavLink>
        </div>

        {/* --- User Management --- */}
        <div>
          {isOpen && (
            <p className="text-gray-400 uppercase text-xs px-4 mb-2">
              User Management
            </p>
          )}
          <NavLink
            to="/admin/add-driver"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <LuBookPlus size={18} /> {isOpen && "Add Driver/Manager"}
          </NavLink>

          <NavLink
            to="/admin/view-users"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <LuSignpost size={18} /> {isOpen && "View Users"}
          </NavLink>
        </div>

        {/* --- Vehicle Management --- */}
        <div>
          {isOpen && (
            <p className="text-gray-400 uppercase text-xs px-4 mb-2">
              Vehicle Management
            </p>
          )}
          <NavLink
            to="/admin/add-vehicle"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <LuBookPlus size={18} /> {isOpen && "Add Vehicle"}
          </NavLink>

          <NavLink
            to="/admin/view-vehicles"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <LuSignpost size={18} /> {isOpen && "View Vehicles"}
          </NavLink>
        </div>

        {/* --- Trip Management --- */}
        <div>
          {isOpen && (
            <p className="text-gray-400 uppercase text-xs px-4 mb-2">
              Trip Management
            </p>
          )}
          <NavLink
            to="/add-trip"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <LuBookPlus size={18} /> {isOpen && "Add Trip"}
          </NavLink>

          <NavLink
            to="/admin/view-trips"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <LuSignpost size={18} /> {isOpen && "View Trips"}
          </NavLink>
        </div>
        {/* --- Reports --- */}
        <div>
          {isOpen && (
            <p className="text-gray-400 uppercase text-xs px-4 mb-2">Reports</p>
          )}
          <NavLink
            to="/admin/view-reports"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <LuSignpost size={18} /> {isOpen && "View Reports"}
          </NavLink>
        </div>
        {/* --- Reports --- */}
        <div>
          {isOpen && (
            <p className="text-gray-400 uppercase text-xs px-4 mb-2">Reports</p>
          )}
          <NavLink
            to="/summary"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <LuChartBar size={18} /> {isOpen && "Summary"}
          </NavLink>

          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <LuUser size={18} /> {isOpen && "Accounts"}
          </NavLink>
        </div>

        {/* --- Settings --- */}
        <div>
          {isOpen && (
            <p className="text-gray-400 uppercase text-xs px-4 mb-2">
              Configuration
            </p>
          )}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-[#ffe6c9] text-black shadow-md"
                  : "hover:bg-gray-700 hover:scale-[1.05]"
              }`
            }
          >
            <LuSettings size={18} /> {isOpen && "Settings"}
          </NavLink>
        </div>
      </nav>

      {/* Logout (Fixed at bottom) */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logouthandle}
          className="flex items-center gap-3 w-full text-red-500 hover:text-red-400 hover:scale-105 transition-all"
        >
          <LuLogOut size={18} /> {isOpen && "Logout"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
