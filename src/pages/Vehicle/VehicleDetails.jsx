import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchVehiclesById } from "../../context/vehicleSlice";
import AdminLayouts from "../../layout/AdminLayouts";

function VehicleDetails() {
  const { id: vehicleId } = useParams();
  const dispatch = useDispatch();
  const { selectedVehicle, loading, error } = useSelector(
    (state) => state.vehicles
  );

  useEffect(() => {
    if (vehicleId) dispatch(fetchVehiclesById(vehicleId));
  }, [dispatch, vehicleId]);

  if (loading)
    return (
      <AdminLayouts>
        <p className="p-6 text-gray-600">Loading...</p>
      </AdminLayouts>
    );
  if (error)
    return (
      <AdminLayouts>
        <p className="p-6 text-red-600">{error}</p>
      </AdminLayouts>
    );
  if (!selectedVehicle)
    return (
      <AdminLayouts>
        <p className="p-6 text-gray-600">Vehicle not found</p>
      </AdminLayouts>
    );

  const v = selectedVehicle;

  return (
    <AdminLayouts>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {v.make} {v.model}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                v.status === "active"
                  ? "bg-green-100 text-green-800"
                  : v.status === "maintenance"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {v.status.toUpperCase()}
            </span>
          </div>

          {/* Vehicle Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-1">License Plate</h3>
              <p className="text-gray-900 font-medium">{v.licensePlate}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-1">Mileage</h3>
              <p className="text-gray-900 font-medium">{v.mileage || "N/A"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-1">Driver</h3>
              <p className="text-gray-900 font-medium">
                {v.assignedDriver?.profile?.name || "N/A"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-1">Location</h3>
              <p className="text-gray-900 font-medium">{v.location || "N/A"}</p>
            </div>
          </div>

          {/* Optional Actions */}
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Edit Vehicle
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Delete Vehicle
            </button>
          </div>
        </div>
      </div>
    </AdminLayouts>
  );
}

export default VehicleDetails;
