import React, { useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import Button from "../../components/ui/Buttons/Button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createUser } from "../../context/userSlice";

function AddDriver() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      return toast.error("Please select a role");
    }

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

    try {
      await dispatch(createUser(payload)).unwrap();
      toast.success("✅ User created successfully!");
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
    } catch (error) {
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to create user"
      );
    }
  };

  return (
    <AdminLayouts>
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          ➕ Add New User
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
                placeholder="Enter full name"
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

          {/* Row 2: License & Role */}
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
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Role
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
                {user.role === "admin" && (
                  <option value="manager">Manager</option>
                )}
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
            <Button type="submit" variant="primary">
              Add User
            </Button>
          </div>
        </form>
      </div>
    </AdminLayouts>
  );
}

export default AddDriver;
