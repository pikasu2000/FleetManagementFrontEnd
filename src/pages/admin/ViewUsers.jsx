import React, { useEffect, useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../../context/userSlice"; // Use your slice actions
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

function ViewUsers() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter users by search and role
  useEffect(() => {
    let temp = [...users];

    if (searchQuery) {
      temp = temp.filter(
        (u) =>
          u.profile?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRole !== "all") {
      temp = temp.filter((u) => u.role === filterRole);
    }

    setFilteredUsers(temp);
  }, [users, searchQuery, filterRole]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Edit
  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setIsEditPopupOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await dispatch(
        updateUser({ id: selectedUser._id, userData: selectedUser })
      ).unwrap();
      toast.success("User updated successfully");
      setIsEditPopupOpen(false);
      dispatch(fetchUsers());
    } catch (err) {
      toast.error(err || "Failed to update user");
    }
  };

  // Delete
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(selectedUser._id)).unwrap();
      toast.success("User deleted successfully");
      setIsDeletePopupOpen(false);
      dispatch(fetchUsers());
    } catch (err) {
      toast.error(err?.message || err?.payload || "Failed to delete user");
    }
  };

  return (
    <AdminLayouts>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Users List</h1>
          <span className="text-gray-600 text-lg">
            Total Users: <b>{filteredUsers.length}</b>
          </span>
        </div>

        {/* Search + Role Filter */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-lg w-1/2"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="driver">Driver</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {/* User List */}
        {loading ? (
          <p>Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center p-4 bg-white shadow rounded-lg"
              >
                <div>
                  <p className="font-semibold">{user.profile?.name}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  <p className="text-sm text-gray-700">
                    Role: <span className="font-medium">{user.role}</span>
                  </p>
                  {user.profile?.licenseNumber && (
                    <p className="text-sm text-gray-700">
                      License: {user.profile.licenseNumber}
                    </p>
                  )}
                </div>
                <div className="space-x-3">
                  <Button onClick={() => handleEdit(user)} variant="secondary">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(user)} variant="danger">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Popup */}
      {isEditPopupOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[650px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              ✏️ Edit User
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      profile: {
                        ...selectedUser.profile,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter email"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="driver">Driver</option>
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button
                onClick={() => setIsEditPopupOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button variant="success" onClick={handleSaveEdit}>
                💾 Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {isDeletePopupOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[350px] text-center">
            <h2 className="text-xl font-bold mb-4">Delete User?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedUser.profile?.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeletePopupOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayouts>
  );
}

export default ViewUsers;
