import React, { useEffect, useState } from "react";
import AdminLayouts from "../layout/AdminLayouts";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Button from "../components/ui/Buttons/Button";
import DeleteCard from "../components/ui/Cards/DeleteCard";
import { fetchTrips, deleteTrip } from "../context/tripSlice";

function ViewTrips() {
  const dispatch = useDispatch();
  const { trips, loading, error } = useSelector((state) => state.trips);

  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch trips
  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  // Filter trips based on search, status, and dates
  useEffect(() => {
    if (!Array.isArray(trips)) return;

    let temp = [...trips];
    console.log(trips);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      temp = temp.filter(
        (t) =>
          t.vehicleId?.make?.toLowerCase().includes(query) ||
          t.vehicleId?.model?.toLowerCase().includes(query) ||
          t.driverId?.username?.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== "all") {
      temp = temp.filter((t) => t.status === filterStatus);
    }

    if (startDate) {
      const start = new Date(startDate);
      temp = temp.filter((t) => new Date(t.startTime) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      temp = temp.filter((t) => new Date(t.endTime || t.startTime) <= end);
    }

    setFilteredTrips(temp);
  }, [trips, searchQuery, filterStatus, startDate, endDate]);

  // Display errors
  useEffect(() => {
    if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error.message || "Something went wrong"
      );
    }
  }, [error]);

  const handleDelete = (trip) => {
    setSelectedTrip(trip);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteTrip(selectedTrip._id)).unwrap();
      toast.success("Trip deleted successfully");
      setIsDeletePopupOpen(false);
      setSelectedTrip(null);
    } catch (err) {
      toast.error(err?.message || "Failed to delete trip");
    }
  };

  return (
    <AdminLayouts>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Trips List</h1>
          <span className="text-gray-600 text-lg">
            Total Trips: <b>{filteredTrips.length}</b>
          </span>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap bg-white p-4 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search by vehicle or driver"
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
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
        </div>

        {/* Trips List */}
        {loading ? (
          <p className="text-gray-600">Loading trips...</p>
        ) : filteredTrips.length === 0 ? (
          <p className="text-gray-600">No trips found.</p>
        ) : (
          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <div
                key={trip._id}
                className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex flex-col">
                  <p className="font-semibold text-lg text-gray-800">
                    {trip.vehicleId?.make} {trip.vehicleId?.model}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Vehicle License: {trip.vehicleId?.licensePlate || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    Status:{" "}
                    <span
                      className={`${
                        trip.status === "ongoing"
                          ? "text-green-600"
                          : trip.status === "completed"
                          ? "text-blue-600"
                          : "text-red-600"
                      } font-medium`}
                    >
                      {trip.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Start:{" "}
                    {trip.startTime
                      ? new Date(trip.startTime).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    End:{" "}
                    {trip.endTime
                      ? new Date(trip.endTime).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    Assigned Driver:{" "}
                    {trip.driverId?.profile?.name ||
                      trip.driverId?.username ||
                      "N/A"}
                  </p>
                </div>

                {/* Only admin can delete */}
                {trip.currentUserRole === "admin" && (
                  <div className="space-x-3 flex-shrink-0">
                    <Button
                      onClick={() => handleDelete(trip)}
                      variant="danger"
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Popup */}
        {isDeletePopupOpen && selectedTrip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <DeleteCard
              vehicle={selectedTrip}
              onCancel={() => setIsDeletePopupOpen(false)}
              onConfirm={confirmDelete}
            />
          </div>
        )}
      </div>
    </AdminLayouts>
  );
}

export default ViewTrips;
