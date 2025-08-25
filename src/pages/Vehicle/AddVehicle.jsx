import React, { useEffect, useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
// import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createVehicle } from "../../context/vehicleSlice";
import { fetchUsers } from "../../context/userSlice";

import Button2 from "../../components/ui/Buttons/Button2";
function AddVehicle() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.vehicles);
  const { users } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    mileage: "",
    status: "active",

    location: "",
  });

  // Fetch users once
  useEffect(() => {
    if (!users.length) dispatch(fetchUsers());
  }, [dispatch, users.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        mileage: Number(formData.mileage),
      };
      await dispatch(createVehicle(payload)).unwrap();
      toast.success("✅ Vehicle created successfully!");
      setFormData({
        make: "",
        model: "",
        year: "",
        licensePlate: "",
        mileage: "",
        status: "active",

        location: "",
      });
    } catch (err) {
      toast.error(err?.message || "❌ Failed to create vehicle");
    }
  };

  return (
    <AdminLayouts>
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          ➕ Add New Vehicle
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Make, Model, Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["make", "model"].map((field) => (
              <div key={field}>
                <label className="block mb-2 font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter vehicle ${field}`}
                  required
                />
              </div>
            ))}

            {/* Year */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter vehicle year"
                required
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          {/* Row 2: License Plate & Assigned Driver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                License Plate
              </label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter license plate"
                required
              />
            </div>
            {/* Mileage */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Mileage
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter mileage"
                min="0"
              />
            </div>
          </div>

          {/* Row 3: Mileage, Location & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Vehicle Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button2 type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Vehicle"}
            </Button2>
          </div>
        </form>
      </div>
    </AdminLayouts>
  );
}

export default AddVehicle;
