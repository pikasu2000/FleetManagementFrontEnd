import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayouts from "../../layout/AdminLayouts";
import toast from "react-hot-toast";
import Button from "../../components/ui/Buttons/Button";
import DeleteCard from "../../components/ui/Cards/DeleteCard";
import { fetchUserTrips, updateTrip } from "../../context/tripSlice";
import socket from "../../utils/socket";

function UserViewTrip() {
  const dispatch = useDispatch();
  const { userTrips, trips, loading, error } = useSelector(
    (state) => state.trips
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchUserTrips());
    console.log("User Trips:", userTrips);
    socket.on("tripUpdated", (trip) => {
      dispatch({ type: "trips/socketUpdateTrip", payload: trip });
    });

    return () => {
      socket.off("tripUpdated");
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : error.message || "Error");
    }
  }, [error]);

  const confirmCancel = async () => {
    try {
      await dispatch(
        updateTrip({
          tripId: selectedTrip?._id,

          updates: { status: "canceled" },
        })
      ).unwrap();

      toast.success("Trip canceled successfully");
      setIsCancelPopupOpen(false);
      setSelectedTrip(null);
    } catch (err) {
      toast.error(err?.message || "Failed to cancel trip");
    }
  };

  const filteredTrips = userTrips.filter((t) => {
    return (
      !searchQuery ||
      t.vehicleId?.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehicleId?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.driverId?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const statusTabs = [
    "all",
    "requested",
    "assigned",
    "ongoing",
    "completed",
    "canceled",
  ];

  const tripsToShow =
    activeTab === "all"
      ? filteredTrips
      : filteredTrips.filter((t) => t.status === activeTab);

  return (
    <AdminLayouts>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Trips</h1>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search by vehicle or driver"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {statusTabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? "primary" : "secondary"}
              
            >
               {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Trips List */}
        {loading ? (
          <p className="text-gray-600">Loading trips...</p>
        ) : tripsToShow.length === 0 ? (
          <p className="text-gray-600">No trips found.</p>
        ) : (
          tripsToShow.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              setSelectedTrip={setSelectedTrip}
              setIsCancelPopupOpen={setIsCancelPopupOpen}
            />
          ))
        )}

        {/* Cancel Popup */}
        {isCancelPopupOpen && selectedTrip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <DeleteCard
              vehicle={selectedTrip}
              onCancel={() => setIsCancelPopupOpen(false)}
              onConfirm={confirmCancel}
            />
          </div>
        )}
      </div>
    </AdminLayouts>
  );
}

const TripCard = ({ trip, setSelectedTrip, setIsCancelPopupOpen }) => {
  // Add conditional styles based on trip status
  const statusColors = {
    canceled: "bg-red-100 border-l-4 border-red-500",
    completed: "bg-green-100 border-l-4 border-green-500",
    ongoing: "bg-blue-100 border-l-4 border-blue-500",
    requested: "bg-yellow-100 border-l-4 border-yellow-500",
    assigned: "bg-purple-100 border-l-4 border-purple-500",
    pending: "bg-white border border-gray-200",
  };

  return (
    <div
      className={`flex flex-col md:flex-row mt-4 justify-between items-start md:items-center p-4 shadow-lg rounded-lg hover:shadow-xl transition-all duration-200 ${
        statusColors[trip.status] || "bg-white"
      }`}
    >
      <div className="flex flex-col">
        <p className="font-semibold text-lg text-gray-800">
          {trip.vehicleId?.make} {trip.vehicleId?.model}
        </p>
        <p className="text-gray-500 text-sm">
          License: {trip.vehicleId?.licensePlate || "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          Status:{" "}
          <span
            className={`font-medium ${
              trip.status === "canceled"
                ? "text-red-600"
                : trip.status === "completed"
                ? "text-green-600"
                : trip.status === "ongoing"
                ? "text-blue-600"
                : "text-gray-700"
            }`}
          >
            {trip.status}
          </span>
        </p>
        <p className="text-sm text-gray-700">
          Start:{" "}
          {trip.startTime ? new Date(trip.startTime).toLocaleString() : "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          End: {trip.endTime ? new Date(trip.endTime).toLocaleString() : "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          Driver:{" "}
          {trip.driverId?.profile?.name || trip.driverId?.username || "N/A"}
        </p>
      </div>

      {trip.status === "pending" && (
        <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
          <Button
            onClick={() => {
              setSelectedTrip(trip);
              setIsCancelPopupOpen(true);
            }}
            variant="danger"
          >
            Cancel trip
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserViewTrip;
