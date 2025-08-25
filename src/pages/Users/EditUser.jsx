import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUser } from "../../context/userSlice";
import Button from "../../components/ui/Buttons/Button";
import toast from "react-hot-toast";
import AdminLayouts from "../../layout/AdminLayouts";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.users);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users if not already loaded
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  // Set selected user when users are loaded
  useEffect(() => {
    const user = users.find((u) => u._id === id);
    if (user) setSelectedUser({ ...user });
  }, [users, id]);

  const handleSaveEdit = async () => {
    try {
      await dispatch(
        updateUser({ id: selectedUser._id, userData: selectedUser })
      ).unwrap();
      toast.success("User updated successfully");
      navigate("/view-users"); // redirect back
    } catch (err) {
      toast.error(err || "Failed to update user");
    }
  };

  if (!selectedUser) return <p className="p-6">Loading user...</p>;

  return (
    <AdminLayouts>
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">✏️ Edit User</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              value={selectedUser.username || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, username: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter username"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={selectedUser.profile?.name || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  profile: { ...selectedUser.profile, name: e.target.value },
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={selectedUser.email || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={selectedUser.phone || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phone: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter phone number"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Address
            </label>
            <input
              type="text"
              value={selectedUser.profile?.address || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  profile: {
                    ...selectedUser.profile,
                    address: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter address"
            />
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              License Number
            </label>
            <input
              type="text"
              value={selectedUser.profile?.licenseNumber || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  profile: {
                    ...selectedUser.profile,
                    licenseNumber: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter license number"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Emergency Contact
            </label>
            <input
              type="text"
              value={selectedUser.profile?.emergencyContact || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  profile: {
                    ...selectedUser.profile,
                    emergencyContact: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter emergency contact"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Role
            </label>
            <select
              value={selectedUser.role || "driver"}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="driver">Driver</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Status
            </label>
            <select
              value={selectedUser.status || "active"}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, status: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button onClick={() => navigate("/view-users")} variant="outline">
            Cancel
          </Button>
          <Button variant="success" onClick={handleSaveEdit}>
            💾 Save
          </Button>
        </div>
      </div>
    </AdminLayouts>
  );
}

export default EditUser;
