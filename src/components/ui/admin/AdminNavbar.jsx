import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { LuBell } from "react-icons/lu";
import ToggeleDarkThemeButton from "../Buttons/ToggeleDarkThemeButton";

function AdminNavbar({ sidebarWidth }) {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target))
        setIsProfileOpen(false);

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      )
        setIsNotificationOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/add-driver": "Add Driver/Manager",
    "/admin/view-users": "View Users",
    "/admin/add-vehicle": "Add Vehicle",
    "/admin/view-vehicles": "View Vehicles",
    "/admin/view-trips": "View Trips",
    "/summary": "Summary",
    "/accounts": "Accounts",
    "/settings": "Settings",
  };

  const title = pageTitles[location.pathname] || "Admin Panel";

  // Dummy notifications
  const notifications = [
    { id: 1, message: "New vehicle added", time: "2m ago" },
    { id: 2, message: "Driver assigned", time: "1h ago" },
    { id: 3, message: "Trip completed", time: "3h ago" },
  ];

  return (
    <div
      className="bg-white shadow-md p-4 flex items-center justify-between fixed top-0 z-10 transition-all duration-300"
      style={{ left: sidebarWidth, right: 0 }}
    >
      {/* Page Title */}
      <h1 className="text-xl font-semibold">{title}</h1>

      {/* Right side: Bell + Profile */}
      <div className="flex items-center gap-4 relative">
        
        <ToggeleDarkThemeButton  />
        {/* Notification Bell */}
        <div ref={notificationRef} className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <LuBell size={22} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 z-50 transform transition-all duration-200 scale-95 opacity-0 animate-dropdown">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-gray-400">{n.time}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-center text-gray-400 py-2 text-sm">
                  No notifications
                </p>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <img
            src="https://static.vecteezy.com/system/resources/previews/002/002/403/large_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
            alt="Profile"
            className="h-10 w-10 rounded-full border cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          />

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 transform transition-all duration-200 scale-95 opacity-0 animate-dropdown">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition">
                Profile
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition">
                Settings
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 transition"
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
