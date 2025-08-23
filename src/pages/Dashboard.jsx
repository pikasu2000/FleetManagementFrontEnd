import React, { useEffect, useState } from "react";
import AdminLayouts from "../layout/AdminLayouts";
import axios from "axios";
import { format } from "date-fns";
import { io } from "socket.io-client";
import { API_BASE_URL, SOCKET_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "../context/vehicleSlice";
import { fetchUsers } from "../context/userSlice";

function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const vehicles = useSelector((state) => state.vehicles.vehicles);
  const totalDrivers = users.filter((u) => u.role === "driver").length;
  const totalManagers = users.filter((u) => u.role === "manager").length;
  const totalVehicles = vehicles.length;
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchVehicles());
  }, []);
  // Fetch recent activities
  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/activity?limit=5`);
      setActivities(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Connect to Socket.IO
    const socket = io(SOCKET_URL);

    // Listen for new activity
    socket.on("new_activity", (activity) => {
      setActivities((prev) => [activity, ...prev]); // add new activity to top
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getActivityBadge = (type) => {
    switch (type) {
      case "driver_assigned":
        return <span className="text-green-600">✔️ Driver Assigned</span>;
      case "vehicle_edited":
        return <span className="text-blue-600">✏️ Vehicle Edited</span>;
      case "trip_started":
        return <span className="text-yellow-600">🏁 Trip Started</span>;
      case "trip_completed":
        return <span className="text-green-600">✅ Trip Completed</span>;
      case "trip_rejected":
        return <span className="text-red-600">❌ Trip Rejected</span>;
      default:
        return <span className="text-gray-600">ℹ️ Other Activity</span>;
    }
  };

  return (
    <AdminLayouts>
      <main className=" p-6 overflow-y-auto gap-6">
        {/* Left side: Dashboard Cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Total Drivers</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {totalDrivers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Total Managers</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {totalManagers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Pending Requests</h2>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {totalVehicles}
            </p>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="mt-8 w-80 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading activities...</p>
          ) : activities?.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activity.</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {activities.map((a) => (
                <li
                  key={a._id}
                  className="flex justify-between items-start bg-gray-50 p-2 rounded-md"
                >
                  <div className="flex flex-col gap-0.5 text-sm">
                    <span className="font-semibold text-gray-700">
                      {a.userId?.name || a.userId?.username || "Unknown User"}
                    </span>
                    <span className="text-gray-500 truncate">{a.message}</span>
                    <span className="text-gray-400 text-xs">
                      {a.relatedVehicle &&
                        `Vehicle: ${a.relatedVehicle.make} ${a.relatedVehicle.model}`}
                      {a.relatedDriver &&
                        ` | Driver: ${
                          a.relatedDriver.name || a.relatedDriver.username
                        }`}
                      {a.relatedTrip && ` | Trip: ${a.relatedTrip.name}`}
                    </span>
                  </div>
                  <div className="text-right text-xs flex flex-col gap-0.5">
                    {getActivityBadge(a.type)}
                    <span className="text-gray-400">
                      {format(new Date(a.createdAt), "HH:mm")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </AdminLayouts>
  );
}

export default Dashboard;
