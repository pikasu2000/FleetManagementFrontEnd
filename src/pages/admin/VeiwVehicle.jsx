import React, { useEffect, useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchVehicles,
  deleteVehicle,
  editVehicle,
  assignDriver,
} from "../../context/vehicleSlice";
import { fetchUsers } from "../../context/userSlice";
import Button from "../../components/ui/Buttons/Button";
import toast from "react-hot-toast";
import DeleteCard from "../../components/ui/Cards/DeleteCard";
import { useNavigate } from "react-router-dom";

function ViewVehicle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vehicles, loading, error } = useSelector((state) => state.vehicles);
  const { users } = useSelector((state) => state.users);

  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDriver, setFilterDriver] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [driverAssignment, setDriverAssignment] = useState({
    vehicleId: null,
    driverId: "",
  });
  const [isAssigning, setIsAssigning] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Fetch vehicles & users
  useEffect(() => {
    dispatch(fetchVehicles());
    if (!users.length) dispatch(fetchUsers());
  }, [dispatch, users.length]);

  // Filtered vehicles
  useEffect(() => {
    let temp = [...vehicles];

    if (searchQuery) {
      temp = temp.filter(
        (v) =>
          v.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      temp = temp.filter((v) => v.status === filterStatus);
    }

    if (filterDriver !== "all") {
      temp = temp.filter((v) => v.assignedDriver?._id === filterDriver);
    }

    setFilteredVehicles(temp);
  }, [vehicles, searchQuery, filterStatus, filterDriver]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // List of all drivers
  const driversList = users.filter((u) => u.role === "driver");

  // === Edit Vehicle ===
  const handleEdit = (vehicle) => {
    setEditingVehicle({
      ...vehicle,
      assignedDriver: vehicle.assignedDriver?._id || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        make: editingVehicle.make,
        model: editingVehicle.model,
        year: editingVehicle.year,
        licensePlate: editingVehicle.licensePlate,
        mileage: editingVehicle.mileage,
        status: editingVehicle.status,
        assignedDriver: editingVehicle.assignedDriver || null,
        location: editingVehicle.location || "",
      };

      await dispatch(
        editVehicle({ id: editingVehicle._id, data: updatedData })
      ).unwrap();
      toast.success("Vehicle updated successfully");
      dispatch(fetchVehicles());
      setEditingVehicle(null);
    } catch (err) {
      toast.error(err?.message || "Failed to update vehicle");
    }
  };

  // === Assign Driver ===
  const handleAssignDriver = (vehicle) => {
    setDriverAssignment({
      vehicleId: vehicle._id,
      driverId: vehicle.assignedDriver?._id || "",
    });
    setIsAssigning(true);
  };

  const handleConfirmAssign = async () => {
    if (!driverAssignment.vehicleId) return;
    try {
      await dispatch(assignDriver(driverAssignment)).unwrap();
      toast.success("Driver assigned successfully");
      setIsAssigning(false);
      dispatch(fetchVehicles());
    } catch (err) {
      toast.error(err?.message || "Failed to assign driver");
    }
  };

  // === Delete Vehicle ===
  const handleDelete = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteVehicle(selectedVehicle._id)).unwrap();
      toast.success("Vehicle deleted successfully");
      setIsDeletePopupOpen(false);
      setSelectedVehicle(null);
      dispatch(fetchVehicles());
    } catch (err) {
      toast.error(err?.message || "Failed to delete vehicle");
    }
  };

  return (
    <AdminLayouts>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Vehicles List</h1>
          <span className="text-gray-600 text-lg">
            Total Vehicles: <b>{filteredVehicles.length}</b>
          </span>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 mb-6 flex-wrap bg-white p-4 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search by make, model, or license plate"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
          <select
            value={filterDriver}
            onChange={(e) => setFilterDriver(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <option value="all">All Drivers</option>
            {driversList.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver?.profile?.name || driver?.username || driver?.email}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicles List */}
        {loading ? (
          <p className="text-gray-600">Loading vehicles...</p>
        ) : filteredVehicles.length === 0 ? (
          <p className="text-gray-600">No vehicles found.</p>
        ) : (
          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                onClick={() => navigate(`/view-vehicles/${vehicle._id}`)}
                className="flex justify-between items-center cursor-pointer p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex flex-col">
                  <p className="font-semibold text-lg text-gray-800">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </p>
                  <p className="text-gray-500 text-sm">
                    License: {vehicle.licensePlate}
                  </p>
                  <p className="text-sm text-gray-700">
                    Mileage: {vehicle.mileage || "N/A"} | Status:{" "}
                    <span
                      className={`${
                        vehicle.status === "active"
                          ? "text-green-600"
                          : vehicle.status === "maintenance"
                          ? "text-yellow-600"
                          : "text-red-600"
                      } font-medium`}
                    >
                      {vehicle.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Assigned Driver:{" "}
                    {vehicle.assignedDriver?.profile?.name ||
                      vehicle.assignedDriver?.username ||
                      vehicle.assignedDriver?.email ||
                      "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    Location: {vehicle.location || "N/A"}
                  </p>
                </div>

                {/* Admin buttons */}
                {currentUser.role === "admin" && (
                  <div className="space-x-3 flex-shrink-0">
                    <Button onClick={() => handleEdit(vehicle)}>Edit</Button>
                    <Button
                      onClick={() => handleDelete(vehicle)}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </div>
                )}

                {/* Manager buttons */}
                {currentUser.role === "manager" && (
                  <div className="space-x-3 flex-shrink-0">
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(vehicle)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleAssignDriver(vehicle)}
                    >
                      Assign Driver
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Edit Vehicle Modal */}
        <AnimatePresence>
          {editingVehicle && (
            <div
              className="fixed inset-0 flex justify-end bg-black bg-opacity-50 z-50"
              onClick={(e) => {
                if (e.target.id === "modal-overlay") setEditingVehicle(null);
              }}
              id="modal-overlay"
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="relative bg-white h-full w-full max-w-lg p-6 shadow-2xl overflow-y-auto"
              >
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-all"
                >
                  ❌
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  ✏️ Edit Vehicle
                </h2>

                <form onSubmit={handleSaveEdit} className="space-y-4">
                  {[
                    "make",
                    "model",
                    "year",
                    "mileage",
                    "licensePlate",
                    "location",
                  ].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type={
                          field === "year" || field === "mileage"
                            ? "number"
                            : "text"
                        }
                        value={editingVehicle[field] || ""}
                        onChange={(e) =>
                          setEditingVehicle({
                            ...editingVehicle,
                            [field]:
                              field === "year" || field === "mileage"
                                ? Number(e.target.value)
                                : e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  ))}

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={editingVehicle.status || "active"}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>

                  {/* Assigned Driver */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Driver
                    </label>
                    <select
                      value={editingVehicle.assignedDriver || ""}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          assignedDriver: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      <option value="">No Driver</option>
                      {driversList.map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver?.profile?.name ||
                            driver?.username ||
                            driver?.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingVehicle(null)}
                      className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Assign Driver Modal */}
        <AnimatePresence>
          {isAssigning && (
            <div
              className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
              onClick={(e) => {
                if (e.target.id === "assign-modal") setIsAssigning(false);
              }}
              id="assign-modal"
            >
              <motion.div
                initial={{ y: "-50%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-50%", opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
              >
                <h2 className="text-xl font-bold mb-4">Assign Driver</h2>

                <select
                  value={driverAssignment.driverId || ""}
                  onChange={(e) =>
                    setDriverAssignment({
                      ...driverAssignment,
                      driverId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                >
                  <option value="">No Driver</option>
                  {driversList.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver?.profile?.name ||
                        driver?.username ||
                        driver?.email}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsAssigning(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAssign}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Assign
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Vehicle Modal */}
        {isDeletePopupOpen && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <DeleteCard
              vehicle={selectedVehicle}
              onCancel={() => setIsDeletePopupOpen(false)}
              onConfirm={confirmDelete}
            />
          </div>
        )}
      </div>
    </AdminLayouts>
  );
}

export default ViewVehicle;
