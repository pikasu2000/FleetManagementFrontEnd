import { Routes, Route } from "react-router-dom";

import AddDriver from "./pages/Users/AddDriver";
import ViewUsers from "./pages/Users/ViewUsers";
import AddVehicle from "./pages/Vehicle/AddVehicle";
import ViewVehicle from "./pages/Vehicle/VeiwVehicle";
import AddTrip from "./pages/Trips/AddTrip";
import Profile from "./pages/Users/Profile";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import ViewTrips from "./pages/Trips/ViewTrips";
import VehicleDetails from "./pages/Vehicle/VehicleDetails";
import GeoFenceDashboard from "./pages/GeoFence/GeoFenceDashboard";
import MaintenanceDashboard from "./pages/Maintenance/MaintenanceDahsboard";
import AddGeofence from "./pages/GeoFence/AddGeoFence";
import EditVehicle from "./pages/Vehicle/EditVehicle";
import AssignDriver from "./pages/Vehicle/AssignDriver";
import ActivityLog from "./pages/ActivityLog";
import EditUser from "./pages/Users/EditUser";
import Register from "./pages/auth/Register";
import { useEffect } from "react";
import UserViewTrip from "./pages/Trips/UserViewTrip";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        {/* Public Routes */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
            <ProtectedRoute roles={["admin", "manager", "user"]}>
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
        <Route
          path="/view-trips/user"
          element={
            <ProtectedRoute roles={["user"]}>
              <UserViewTrip />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute roles={["admin", "driver", "manager", "user"]}>
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
          path="/edit-users/:id"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <EditUser />
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

        <Route
          path="/edit-vehicle/:id"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <EditVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assign-driver/:id"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <AssignDriver />
            </ProtectedRoute>
          }
        />
        {/* GeoFence */}
        <Route
          path="/geo-fence"
          element={
            <ProtectedRoute roles={["admin", "manager", "driver"]}>
              <GeoFenceDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-geo-fence"
          element={
            <ProtectedRoute roles={["admin", "manager", "driver"]}>
              <AddGeofence />
            </ProtectedRoute>
          }
        />

        {/* Maintenance */}
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute roles={["admin", "manager", "driver"]}>
              <MaintenanceDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity-log"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <ActivityLog />
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
