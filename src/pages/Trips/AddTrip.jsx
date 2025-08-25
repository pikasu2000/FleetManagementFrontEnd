import React, { useEffect, useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "../../context/vehicleSlice";
import { createTrip } from "../../context/tripSlice";
import toast from "react-hot-toast";
import { DatePicker } from "antd";
import Button from "../../components/ui/Buttons/Button";
import moment from "moment";

function AddTrip() {
  const dispatch = useDispatch();
  const { vehicles } = useSelector((state) => state.vehicles);
  const { trips } = useSelector((state) => state.trips);

  const [formData, setFormData] = useState({
    startLocation: "",
    endLocation: "",
    startTime: null,
    endTime: null,
    distance: "",
    purpose: "",
    fuelUsed: "",
    tripType: "",
    vehicleId: "",
  });

  // Fetch vehicles on mount
  useEffect(() => {
    if (!vehicles.length) dispatch(fetchVehicles());
    console.log("Vehicles:", vehicles);
  }, [dispatch, vehicles.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (field, value) => {
    setFormData({ ...formData, [field]: value ? value.toDate() : null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields check
    if (
      !formData.startLocation ||
      !formData.endLocation ||
      !formData.startTime ||
      !formData.vehicleId ||
      !formData.tripType
    ) {
      return toast.error("Please fill all required fields!");
    }

    if (formData.endTime && formData.startTime > formData.endTime) {
      return toast.error("Start time must be before end time!");
    }

    try {
      const payload = {
        ...formData,
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime ? formData.endTime.toISOString() : null,
        distance: formData.distance ? Number(formData.distance) : undefined,
        fuelUsed: formData.fuelUsed ? Number(formData.fuelUsed) : undefined,
        status: "pending", // synced with backend and trips view
      };

      await dispatch(createTrip(payload)).unwrap();
      toast.success("Trip request created successfully!");
      setFormData({
        startLocation: "",
        endLocation: "",
        startTime: null,
        endTime: null,
        distance: "",
        purpose: "",
        fuelUsed: "",
        tripType: "",
        vehicleId: "",
      });
    } catch (error) {
      const message =
        error?.data?.message || error?.message || "Failed to create trip";
      toast.error(message);
    }
  };

  // Compute vehicle availability
  const vehiclesWithStatus = vehicles.map((vehicle) => {
    const assignedTrip = trips.find(
      (t) =>
        t.vehicleId?._id === vehicle._id &&
        ["pending", "assigned", "ongoing"].includes(t.status)
    );
    return {
      ...vehicle,
      isAvailable: !assignedTrip,
    };
  });

  const selectedVehicle = vehicles.find((v) => v._id === formData.vehicleId);

  return (
    <AdminLayouts>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Request a Trip
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
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
              {vehiclesWithStatus.map((v) => (
                <option
                  key={v._id}
                  value={v._id}
                  disabled={!v.isAvailable}
                  className={!v.isAvailable ? "text-gray-400" : ""}
                >
                  {v.make} {v.model} ({v.licensePlate}){" "}
                  {v.isAvailable ? "" : "(Assigned)"}
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

            {vehiclesWithStatus.filter((v) => v.isAvailable).length === 0 && (
              <p className="text-red-500 mt-2 text-sm">
                No available vehicles at the moment.
              </p>
            )}
          </div>

          {/* Trip Type */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Trip Type <span className="text-red-500">*</span>
            </label>
            <select
              name="tripType"
              value={formData.tripType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Trip Type</option>
              <option value="delivery">Delivery</option>
              <option value="passenger">Passenger</option>
              <option value="personal">Personal</option>
            </select>
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
            <Button
              type="submit"
              variant="primary"
              disabled={!formData.vehicleId}
            >
              Request Trip
            </Button>
          </div>
        </form>
      </div>
    </AdminLayouts>
  );
}

export default AddTrip;
