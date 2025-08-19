import React from "react";
import { LuBell } from "react-icons/lu";
import { useLocation } from "react-router-dom";
function AdminNavbar() {
  const location = useLocation();

  // Map routes to page titles
  const pageTitles = {
    "/": "Dashboard",
    "/add-driver": "Add Driver/Manager",
    "/posts": "View Posts",
    "/summary": "Summary",
    "/accounts": "Accounts",
    "/settings": "Settings",
    "/logout": "Logout",
  };

  const title = pageTitles[location.pathname] || "Admin Panel";

  return (
    <div className="bg-white shadow-md p-4 flex items-center justify-between fixed top-0 left-64 right-0 z-10">
      {/* Page Title */}
      <h1 className="text-xl font-semibold">{title}</h1>

      {/* Right side (Profile / Notifications etc.) */}
      <div className="flex items-center gap-4">
        <button className="bg-[#ffe6c9] text-black px-3 py-1 rounded-md font-medium hover:bg-[#ffcf99]">
          Notifications
        </button>
        <img
          src="https://static.vecteezy.com/system/resources/previews/002/002/403/large_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
          alt="Profile"
          className="h-10 w-10 rounded-full border"
        />
      </div>
    </div>
  );
}

export default AdminNavbar;
