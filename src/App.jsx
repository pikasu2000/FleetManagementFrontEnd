import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/admin/Dashboard";
import AddDriver from "./pages/admin/AddDriver";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import ViewUsers from "./pages/admin/ViewUsers";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/add-driver" element={<AddDriver />} />
        <Route path="/admin/view-users" element={<ViewUsers />} />
      </Routes>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "linear-gradient(to right, #2563eb, #7c3aed)",
              color: "white",
              fontWeight: "500",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            iconTheme: {
              primary: "white",
              secondary: "rgba(255,255,255,0.2)",
            },
          },
          error: {
            style: {
              background: "linear-gradient(to right, #dc2626, #ef4444)", // red shades
              color: "white",
              fontWeight: "500",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            iconTheme: {
              primary: "white",
              secondary: "rgba(255,255,255,0.2)",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
