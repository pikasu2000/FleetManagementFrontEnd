import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AdminNavbar from "../components/ui/admin/AdminNavbar";

function AdminLayouts({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar fixed */}
      <div className="w-64 h-screen fixed top-0 left-0">
        <Sidebar />
      </div>

      {/* Main content with navbar */}
      <div className="flex-1 ml-64">
        {/* Navbar fixed at the top */}
        <AdminNavbar />

        {/* Page content with padding so it stays below navbar */}
        <div className="p-6 pt-20 min-h-screen overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayouts;
