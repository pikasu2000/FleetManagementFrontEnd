import React, { useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import Button from "../../components/ui/Button";
import { API_BASE_URL } from "../../config";
import toast from "react-hot-toast";
import axios from "axios";

function AddDriver() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    license: "",
    email: "",
    password: "",
    role: "",
    address: "",
    emergencyContact: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password || "default123",
        role: formData.role,
        address: formData.address,
        licenseNumber: formData.license,
        emergencyContact: formData.emergencyContact,
      };

      const res = await axios.post(`${API_BASE_URL}/users/create`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success("✅ Driver created successfully!");
        setFormData({
          name: "",
          phone: "",
          license: "",
          email: "",
          password: "",
          role: "",
          address: "",
          emergencyContact: "",
        });
      } else {
        toast.error("Error creating driver:", data.message || res.statusText);
      }
    } catch (error) {
      toast.error("Error creating driver:", error);
    }
  };

  return (
    <AdminLayouts>
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          ➕ Add New Driver
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter driver's name"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Row 2: License & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                License Number
              </label>
              <input
                type="text"
                name="license"
                value={formData.license}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter license number"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Position
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Role</option>
                <option value="driver">Driver</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address"
              required
            />
          </div>

          {/* Row 3: Emergency Contact & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Emergency Contact
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter emergency contact"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleSubmit}>
              Add Driver
            </Button>
          </div>
        </form>
      </div>
    </AdminLayouts>
  );
}

export default AddDriver;
