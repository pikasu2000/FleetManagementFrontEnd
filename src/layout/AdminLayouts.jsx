import React, { useRef, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/ui/admin/AdminNavbar";
import { useLocation } from "react-router-dom";

function AdminLayouts({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidth = isSidebarOpen ? "16rem" : "5rem";

  const contentRef = useRef(null);
  const scrollPositions = useRef({}); // to store scroll positions
  const location = useLocation();

  // Save scroll position before route change
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (contentRef.current) {
        scrollPositions.current[location.pathname] =
          contentRef.current.scrollTop;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [location.pathname]);

  // Restore scroll position after route change
  useEffect(() => {
    if (contentRef.current) {
      const savedScroll = scrollPositions.current[location.pathname] || 0;
      contentRef.current.scrollTop = savedScroll;
    }
  }, [location]);

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <div
        className="h-full fixed top-0 left-0 transition-all duration-300 z-50"
        style={{ width: sidebarWidth }}
      >
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <AdminNavbar sidebarWidth={sidebarWidth} />

        {/* Scrollable content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6 pt-20">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayouts;
