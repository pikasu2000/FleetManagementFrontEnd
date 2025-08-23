import React, { useEffect, useState } from "react";
import AdminLayouts from "../layout/AdminLayouts";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../context/userSlice";
import { fetchVehicles } from "../context/vehicleSlice";
import { createTrip } from "../context/tripSlice";
import toast from "react-hot-toast";
import { DatePicker } from "antd";
import Button from "../components/ui/Buttons/Button";
import moment from "moment";

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
    status: "",
    type: "",
  });

  // Fetch users and vehicles on mount
  useEffect(() => {
    if (!users.length) dispatch(fetchUsers());
    if (!vehicles.length) dispatch(fetchVehicles());
  }, [dispatch, users.length, vehicles.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (field, value) => {
    // value is a moment object from Ant Design DatePicker
    setFormData({ ...formData, [field]: value ? value.toDate() : null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
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

    // Validate startTime < endTime
    if (formData.endTime && formData.startTime > formData.endTime) {
      toast.error("Start time must be before end time!");
      return;
    }

    try {
      const payload = {
        ...formData,
        startTime: formData.startTime ? formData.startTime.toISOString() : null,
        endTime: formData.endTime ? formData.endTime.toISOString() : null,
        distance: formData.distance ? Number(formData.distance) : undefined,
        fuelUsed: formData.fuelUsed ? Number(formData.fuelUsed) : undefined,
      };

      await dispatch(createTrip(payload)).unwrap();
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
        status: "",
        type: "",
      });
    } catch (error) {
      console.error("Error adding trip:", error);

      // Safe access of error message
      const message =
        error?.data?.message || // if backend sends {data: {message: ...}}
        error?.message || // normal JS error
        "Failed to add trip";

      toast.error(message);
    }
  };

  const selectedDriver = users.find((u) => u._id === formData.driverId);
  const selectedVehicle = vehicles.find((v) => v._id === formData.vehicleId);

  return (
    <AdminLayouts>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Add Trip</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Driver */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Driver <span className="text-red-500">*</span>
            </label>
            <select
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Driver</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.profile?.name || u.username}
                </option>
              ))}
            </select>

            {selectedDriver && (
              <div className="mt-2 p-2 border rounded-lg bg-gray-50 text-gray-700 text-sm">
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedDriver.profile?.name || selectedDriver.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedDriver.email}
                </p>
              </div>
            )}
          </div>

          {/* Vehicle */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Vehicle <span className="text-red-500">*</span>
            </label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.make} {v.model} ({v.licensePlate})
                </option>
              ))}
            </select>

            {selectedVehicle && (
              <div className="mt-2 p-2 border rounded-lg bg-gray-50 text-gray-700 text-sm">
                <p>
                  <strong>Make & Model:</strong> {selectedVehicle.make}{" "}
                  {selectedVehicle.model}
                </p>
                <p>
                  <strong>License Plate:</strong> {selectedVehicle.licensePlate}
                </p>
              </div>
            )}
          </div>

          {/* Start Location */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Start Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="startLocation"
              value={formData.startLocation}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* End Location */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              End Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="endLocation"
              value={formData.endLocation}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Start Time <span className="text-red-500">*</span>
            </label>
            <DatePicker
              showTime
              value={formData.startTime ? moment(formData.startTime) : null}
              onChange={(value) => handleDateChange("startTime", value)}
              className="w-full"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              End Time
            </label>
            <DatePicker
              showTime
              value={formData.endTime ? moment(formData.endTime) : null}
              onChange={(value) => handleDateChange("endTime", value)}
              className="w-full"
            />
          </div>
          {/* Status */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Trip Type */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Trip Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Trip Type</option>
              <option value="delivery">Delivery</option>
              <option value="passenger">Passenger</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          {/* Distance */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Distance (km)
            </label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              min="0"
            />
          </div>

          {/* Fuel Used */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Fuel Used (liters)
            </label>
            <input
              type="number"
              name="fuelUsed"
              value={formData.fuelUsed}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              min="0"
            />
          </div>

          {/* Purpose */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold text-gray-700">
              Purpose
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              rows="4"
            ></textarea>
          </div>

          {/* Submit */}
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
