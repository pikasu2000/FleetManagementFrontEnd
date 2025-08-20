import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/ui/admin/AdminNavbar";

function AdminLayouts({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Width values
  const sidebarWidth = isSidebarOpen ? "16rem" : "5rem";

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <div
        className={`h-screen fixed top-0 left-0 transition-all duration-300 z-50`}
        style={{ width: sidebarWidth }}
      >
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Main content */}
      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Navbar */}
        <AdminNavbar sidebarWidth={sidebarWidth} />

        {/* Page Content */}
        <div className="p-6 pt-20 min-h-screen overflow-y-auto transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayouts;
