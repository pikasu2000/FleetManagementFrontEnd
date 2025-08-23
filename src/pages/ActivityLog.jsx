import React, { useEffect, useState } from "react";
import AdminLayouts from "../layout/AdminLayouts";
import { format } from "date-fns";
import axios from "axios";

function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [searchUser, setSearchUser] = useState("");

  const fetchActivities = async () => {
    try {
      const res = await axios.get("/api/activities");
      setActivities(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((a) => {
    const typeMatch = filterType === "all" || a.type === filterType;
    const userMatch =
      !searchUser ||
      a.userId?.name?.toLowerCase().includes(searchUser.toLowerCase());
    return typeMatch && userMatch;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case "driver_assigned":
        return (
          <span className="text-green-700 font-semibold">Driver Assigned</span>
        );
      case "vehicle_edited":
        return (
          <span className="text-blue-700 font-semibold">Vehicle Edited</span>
        );
      case "trip_started":
        return (
          <span className="text-yellow-700 font-semibold">Trip Started</span>
        );
      case "trip_completed":
        return (
          <span className="text-green-700 font-semibold">Trip Completed</span>
        );
      case "trip_rejected":
        return (
          <span className="text-red-700 font-semibold">Trip Rejected</span>
        );
      default:
        return <span className="text-gray-500 font-semibold">Other</span>;
    }
  };

  return (
    <AdminLayouts>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Activity Log</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Search by user"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="driver_assigned">Driver Assigned</option>
            <option value="vehicle_edited">Vehicle Edited</option>
            <option value="trip_started">Trip Started</option>
            <option value="trip_completed">Trip Completed</option>
            <option value="trip_rejected">Trip Rejected</option>
          </select>
        </div>

        {loading ? (
          <p>Loading activities...</p>
        ) : filteredActivities.length === 0 ? (
          <p>No activities found.</p>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((a) => (
              <div
                key={a._id}
                className="p-4 bg-white shadow-md rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="text-gray-700 font-medium">
                    {a.userId?.name || a.userId?.username || "Unknown User"}
                  </div>
                  <div className="text-gray-500 text-sm">{a.message}</div>
                  <div className="text-gray-400 text-sm">
                    {a.relatedVehicle &&
                      `Vehicle: ${a.relatedVehicle.make} ${a.relatedVehicle.model}`}
                    {a.relatedDriver &&
                      ` | Driver: ${
                        a.relatedDriver.name || a.relatedDriver.username
                      }`}
                    {a.relatedTrip && ` | Trip: ${a.relatedTrip.name}`}
                  </div>
                </div>
                <div className="flex flex-col items-end mt-2 sm:mt-0">
                  {getTypeBadge(a.type)}
                  <div className="text-gray-400 text-xs mt-1">
                    {format(new Date(a.createdAt), "dd MMM yyyy HH:mm")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminLayouts>
  );
}

export default ActivityLog;
