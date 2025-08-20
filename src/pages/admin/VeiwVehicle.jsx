import React, { useEffect, useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVehicles,
  deleteVehicle,
  editVehicle,
} from "../../context/vehicleSlice";
import { fetchUsers } from "../../context/userSlice";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

function ViewVehicle() {
  const dispatch = useDispatch();
  const { vehicles, loading, error } = useSelector((state) => state.vehicles);
  const { users } = useSelector((state) => state.users);

  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDriver, setFilterDriver] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchVehicles());
    if (!users.length) dispatch(fetchUsers());
  }, [dispatch, users.length]);

  useEffect(() => {
    let temp = [...vehicles];

    // Search filter
    if (searchQuery) {
      temp = temp.filter(
        (v) =>
          v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      temp = temp.filter((v) => v.status === filterStatus);
    }

    // Driver filter
    if (filterDriver !== "all") {
      temp = temp.filter((v) => v.assignedDriver === filterDriver);
    }

    setFilteredVehicles(temp);
  }, [vehicles, searchQuery, filterStatus, filterDriver]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const getDriverName = (driverId) => {
    const driver = users.find((u) => u._id === driverId);
    return driver?.profile?.name || driver?.username || "N/A";
  };

  // === Edit ===
  const handleEdit = (vehicle) => {
    setSelectedVehicle({ ...vehicle });
    setIsEditPopupOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await dispatch(
        editVehicle({ id: selectedVehicle._id, vehicleData: selectedVehicle })
      ).unwrap();
      toast.success("Vehicle updated successfully");
      setIsEditPopupOpen(false);
      dispatch(fetchVehicles());
    } catch (err) {
      toast.error(err?.message || "Failed to update vehicle");
    }
  };

  // === Delete ===
  const handleDelete = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteVehicle(selectedVehicle._id)).unwrap();
      toast.success("Vehicle deleted successfully");
      setIsDeletePopupOpen(false);
      dispatch(fetchVehicles());
    } catch (err) {
      toast.error(err?.message || "Failed to delete vehicle");
    }
  };

  return (
    <AdminLayouts>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Vehicles List</h1>
          <span className="text-gray-600 text-lg">
            Total Vehicles: <b>{filteredVehicles.length}</b>
          </span>
        </div>

        {/* Search + Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by make, model, or license plate"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-lg w-full sm:w-1/3"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterDriver}
            onChange={(e) => setFilterDriver(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Drivers</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.profile?.name || u.username}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle List */}
        {loading ? (
          <p>Loading vehicles...</p>
        ) : filteredVehicles.length === 0 ? (
          <p>No vehicles found.</p>
        ) : (
          <div className="space-y-2">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="flex justify-between items-center p-4 bg-white shadow rounded-lg"
              >
                <div className="flex flex-col">
                  <p className="font-semibold">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </p>
                  <p className="text-gray-500 text-sm">
                    License: {vehicle.licensePlate}
                  </p>
                  <p className="text-sm text-gray-700">
                    Mileage: {vehicle.mileage || "N/A"} | Status:{" "}
                    {vehicle.status}
                  </p>
                  <p className="text-sm text-gray-700">
                    Assigned Driver: {getDriverName(vehicle.assignedDriver)}
                  </p>
                  <p className="text-sm text-gray-700">
                    Location: {vehicle.location || "N/A"}
                  </p>
                </div>
                <div className="space-x-3 flex-shrink-0">
                  <Button
                    onClick={() => handleEdit(vehicle)}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(vehicle)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Popup */}
        {isEditPopupOpen && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">
                ✏️ Edit Vehicle
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Make */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    value={selectedVehicle.make || ""}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        make: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter make"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={selectedVehicle.model || ""}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        model: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter model"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={selectedVehicle.year || ""}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        year: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter year"
                  />
                </div>

                {/* License Plate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    License Plate
                  </label>
                  <input
                    type="text"
                    value={selectedVehicle.licensePlate || ""}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        licensePlate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter license plate"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Vehicle Status
                  </label>
                  <select
                    value={selectedVehicle.status || "active"}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Assigned Driver */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Assigned Driver
                  </label>
                  <select
                    value={selectedVehicle.assignedDriver || ""}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        assignedDriver: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Driver</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.profile?.name || u.username}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={selectedVehicle.location || ""}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => setIsEditPopupOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} variant="success">
                  💾 Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {isDeletePopupOpen && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[350px] text-center">
              <h2 className="text-xl font-bold mb-4">Delete Vehicle?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {selectedVehicle.make} {selectedVehicle.model}
                </span>
                ?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeletePopupOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayouts>
  );
}

export default ViewVehicle;
