import { Routes, Route } from "react-router-dom";

import AddDriver from "./pages/admin/AddDriver";
import ViewUsers from "./pages/admin/ViewUsers";
import AddVehicle from "./pages/admin/AddVehicle";
import ViewVehicle from "./pages/admin/VeiwVehicle";
import AddTrip from "./pages/AddTrip";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import ViewTrips from "./pages/ViewTrips";
import VehicleDetails from "./pages/VehicleDetails";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        {/* Public Routes */}

        <Route path="/login" element={<Login />} />

        {/* Profile accessible by all logged-in users */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["admin", "driver", "manager"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Trip accessible by drivers and admin */}
        <Route
          path="/add-trip"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <AddTrip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-trips"
          element={
            <ProtectedRoute roles={["admin", "driver", "manager"]}>
              <ViewTrips />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute roles={["admin", "driver", "manager"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-driver"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <AddDriver />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-users"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <ViewUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-vehicle"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <AddVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-vehicles"
          element={
            <ProtectedRoute roles={["admin", "manager", "driver"]}>
              <ViewVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-vehicles/:id"
          element={
            <ProtectedRoute roles={["admin", "manager", "driver"]}>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />
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
            iconTheme: { primary: "white", secondary: "rgba(255,255,255,0.2)" },
          },
          error: {
            style: {
              background: "linear-gradient(to right, #dc2626, #ef4444)",
              color: "white",
              fontWeight: "500",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            iconTheme: { primary: "white", secondary: "rgba(255,255,255,0.2)" },
          },
        }}
      />
    </div>
  );
}

export default App;
