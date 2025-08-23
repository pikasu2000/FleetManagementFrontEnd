import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGeofences,
  fetchAlerts,
  checkVehicleLocation,
} from "../../context/geoFenceSlice";
import { fetchVehicles } from "../../context/vehicleSlice";
import AdminLayouts from "../../layout/AdminLayouts";
import { FaCar, FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";
import Button from "../../components/ui/Buttons/Button";
import toast from "react-hot-toast";

const GeoFenceDashboard = () => {
  const dispatch = useDispatch();
  const { geofences, alerts } = useSelector((state) => state.geoFences);
  const { vehicles } = useSelector((state) => state.vehicles);
  const [vehicleLocation, setVehicleLocation] = useState({
    vehicleId: "",
    lat: 0,
    lng: 0,
  });

  const contentRef = useRef(null); // Persistent scroll

  useEffect(() => {
    dispatch(fetchGeofences());
    dispatch(fetchAlerts());
    dispatch(fetchVehicles());
    const interval = setInterval(() => dispatch(fetchAlerts()), 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleCheckLocation = () => {
    if (!vehicleLocation.vehicleId) return toast.error("Select a vehicle!");

    dispatch(checkVehicleLocation(vehicleLocation));
    toast.success("Location checked successfully!");
    setVehicleLocation({ vehicleId: "", lat: 0, lng: 0 });
  };

  return (
    <AdminLayouts>
      <div ref={contentRef} className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Geofence Dashboard</h1>

        {/* Simulation Card */}
        <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Simulate Vehicle Location
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <select
              className="border rounded-lg p-2"
              value={vehicleLocation.vehicleId}
              onChange={(e) =>
                setVehicleLocation({
                  ...vehicleLocation,
                  vehicleId: e.target.value,
                })
              }
            >
              <option value="">Select Vehicle</option>
              {vehicles?.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name || v.licensePlate}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Latitude"
              className="border p-2 rounded-lg focus:ring focus:ring-blue-200"
              value={vehicleLocation.lat}
              onChange={(e) =>
                setVehicleLocation({
                  ...vehicleLocation,
                  lat: parseFloat(e.target.value),
                })
              }
            />
            <input
              type="number"
              placeholder="Longitude"
              className="border p-2 rounded-lg focus:ring focus:ring-blue-200"
              value={vehicleLocation.lng}
              onChange={(e) =>
                setVehicleLocation({
                  ...vehicleLocation,
                  lng: parseFloat(e.target.value),
                })
              }
            />
            <Button onClick={handleCheckLocation} variant="primary">
              Check
            </Button>
          </div>
        </div>

        {/* Geofences */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Geofences</h2>
          {geofences?.length === 0 ? (
            <p className="text-gray-600">No geofences defined</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {geofences.map((geo) => (
                <div
                  key={geo._id}
                  className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition relative"
                >
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-blue-500 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {geo.name}
                    </h3>
                  </div>
                  <p className="flex items-center text-gray-700 mb-1">
                    <FaCar className="mr-2 text-gray-500" />
                    {geo.vehicleId?.licensePlate ||
                      geo.vehicleId?.name ||
                      "N/A"}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Lat:</span> {geo.center.lat}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Lng:</span> {geo.center.lng}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Radius:</span> {geo.radius} m
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Geofence Alerts
          </h2>
          {alerts?.length === 0 ? (
            <p className="text-gray-600">No alerts</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 hover:shadow-md transition relative"
                >
                  <div className="flex items-center mb-2">
                    <FaExclamationTriangle className="text-red-500 mr-2" />
                    <span className="font-semibold text-red-700">
                      {alert.alertMessage}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Vehicle:</span>{" "}
                    {alert.vehicleId?.licensePlate ||
                      alert.vehicleId?.name ||
                      "N/A"}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Geofence:</span>{" "}
                    {alert.geofenceId?.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(alert.alertDate).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayouts>
  );
};

export default GeoFenceDashboard;
