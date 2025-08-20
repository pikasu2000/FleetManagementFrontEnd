import React, { useEffect, useState } from "react";
import AdminLayouts from "../layout/AdminLayouts";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../context/userSlice";
import { fetchVehicles } from "../context/vehicleSlice";
import { createTrip } from "../context/tripSlice"; // Make sure you have this action
import toast from "react-hot-toast";
import { DatePicker } from "antd";
import moment from "moment";
import Button from "../components/ui/Button";

function AddTrip() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { vehicles } = useSelector((state) => state.vehicles);

  const [formData, setFormData] = useState({
    driverId: "",
    vehicleId: "",
    startLocation: "",
    endLocation: "",
    startTime: null,
    endTime: null,
    distance: "",
    purpose: "",
    fuelUsed: "",
  });

  useEffect(() => {
    if (!users.length) dispatch(fetchUsers());
    if (!vehicles.length) dispatch(fetchVehicles());
  }, [dispatch, users.length, vehicles.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateTimeChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.driverId ||
      !formData.vehicleId ||
      !formData.startLocation ||
      !formData.endLocation ||
      !formData.startTime
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      await dispatch(createTrip(formData));
      toast.success("Trip added successfully!");
      setFormData({
        driverId: "",
        vehicleId: "",
        startLocation: "",
        endLocation: "",
        startTime: null,
        endTime: null,
        distance: "",
        purpose: "",
        fuelUsed: "",
      });
    } catch (error) {
      toast.error("Failed to add trip");
    }
  };

  const selectedDriver = users.find((u) => u._id === formData.driverId);
  const selectedVehicle = vehicles.find((v) => v._id === formData.vehicleId);

  return (
    <AdminLayouts>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add Trip</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Driver */}
          <div>
            <label className="block mb-1 font-semibold">Driver *</label>
            <select
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select Driver</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.profile?.name || u.username}
                </option>
              ))}
            </select>

            {/* Driver Preview */}
            {selectedDriver && (
              <div className="mt-2 p-2 border rounded-lg bg-gray-50 text-gray-800 text-sm">
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedDriver.profile?.name || selectedDriver.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedDriver.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedDriver.role || "Driver"}
                </p>
              </div>
            )}
          </div>

          {/* Vehicle */}
          <div>
            <label className="block mb-1 font-semibold">Vehicle *</label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.make} {v.model} ({v.licensePlate})
                </option>
              ))}
            </select>

            {/* Vehicle Preview */}
            {selectedVehicle && (
              <div className="mt-2 p-2 border rounded-lg bg-gray-50 text-gray-800 text-sm">
                <p>
                  <strong>Make & Model:</strong> {selectedVehicle.make}{" "}
                  {selectedVehicle.model}
                </p>
                <p>
                  <strong>License Plate:</strong> {selectedVehicle.licensePlate}
                </p>
                <p>
                  <strong>Status:</strong> {selectedVehicle.status}
                </p>
                <p>
                  <strong>Location:</strong> {selectedVehicle.location || "N/A"}
                </p>
              </div>
            )}
          </div>

          {/* Start Location */}
          <div>
            <label className="block mb-1 font-semibold">Start Location *</label>
            <input
              type="text"
              name="startLocation"
              value={formData.startLocation}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Enter start location"
            />
          </div>

          {/* End Location */}
          <div>
            <label className="block mb-1 font-semibold">End Location *</label>
            <input
              type="text"
              name="endLocation"
              value={formData.endLocation}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Enter end location"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block mb-1 font-semibold">Start Time *</label>
            <DatePicker
              showTime
              value={formData.startTime ? moment(formData.startTime) : null}
              onChange={(value) => handleDateTimeChange("startTime", value)}
              className="w-full rounded-lg"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block mb-1 font-semibold">End Time</label>
            <DatePicker
              showTime
              value={formData.endTime ? moment(formData.endTime) : null}
              onChange={(value) => handleDateTimeChange("endTime", value)}
              className="w-full rounded-lg"
            />
          </div>

          {/* Distance */}
          <div>
            <label className="block mb-1 font-semibold">Distance (km)</label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Enter distance"
            />
          </div>

          {/* Fuel Used */}
          <div>
            <label className="block mb-1 font-semibold">
              Fuel Used (liters)
            </label>
            <input
              type="number"
              name="fuelUsed"
              value={formData.fuelUsed}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Enter fuel used"
            />
          </div>

          {/* Purpose */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold">Purpose</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Enter purpose of trip"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" variant="primary">
              Add Trip
            </Button>
          </div>
        </form>
      </div>
    </AdminLayouts>
  );
}

export default AddTrip;
