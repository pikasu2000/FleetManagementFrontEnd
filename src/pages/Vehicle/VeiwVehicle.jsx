import React, { useEffect, useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles, deleteVehicle } from "../../context/vehicleSlice";
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

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Fetch vehicles & users
  useEffect(() => {
    dispatch(fetchVehicles());
    if (!users.length) dispatch(fetchUsers());
  }, [dispatch, users.length]);

  // Filter vehicles
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

    if (filterStatus !== "all")
      temp = temp.filter((v) => v.status === filterStatus);
    if (filterDriver !== "all")
      temp = temp.filter((v) => v.assignedDriver?._id === filterDriver);

    setFilteredVehicles(temp);
  }, [vehicles, searchQuery, filterStatus, filterDriver]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // List of drivers
  const driversList = users.filter((u) => u.role === "driver");

  // Delete vehicle
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
                className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all duration-200"
              >
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={() => navigate(`/view-vehicles/${vehicle._id}`)}
                >
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
                    Location: {vehicle.location || "N/A"}
                  </p>
                </div>

                {/* Manager buttons */}
                {/* Admin & Manager buttons */}
                {(currentUser.role === "admin" ||
                  currentUser.role === "manager") && (
                  <div className="space-x-3 flex-shrink-0">
                    <Button
                      variant="warning"
                      onClick={() => navigate(`/edit-vehicle/${vehicle._id}`)}
                    >
                      Edit
                    </Button>
                    
                    {currentUser.role === "admin" && (
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(vehicle)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
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
