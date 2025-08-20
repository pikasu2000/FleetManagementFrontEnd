import React, { useEffect, useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import { API_BASE_URL } from "../../config";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";

function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Fetch all users
  const handleUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/getAllUser`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    }
  };

  // Filter users based on search and role
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
    setCurrentPage(1); // reset to first page when filters change
  }, [searchQuery, filterRole, users]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Open edit popup
  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setIsEditPopupOpen(true);
  };

  // Save edited user
  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/users/edit/${selectedUser._id}`,
        selectedUser,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("User updated successfully");
      setIsEditPopupOpen(false);
      handleUsers();
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  // Open delete popup
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeletePopupOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/users/delete/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("User deleted successfully");
      setIsDeletePopupOpen(false);
      handleUsers();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  useEffect(() => {
    handleUsers();
  }, []);

  return (
    <AdminLayouts>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Users List</h1>
          <span className="text-gray-600 text-lg">
            Total Users: <b>{filteredUsers.length}</b>
          </span>
        </div>

        {/* Search + Filter */}
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
        <div className="grid grid-cols-1 gap-4">
          {currentUsers.map((user) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ✅ Edit Popup (unchanged) */}
      {isEditPopupOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[650px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              ✏️ Edit User
            </h2>

            {/* Form Fields */}
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
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter username"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter phone number"
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

              {/* Address */}
              <div className="col-span-2">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-8">
              <Button
                onClick={() => setIsEditPopupOpen(false)}
                variant="outline"
                size="md"
              >
                Cancel
              </Button>
              <Button variant="success" size="md" onClick={handleSaveEdit}>
                💾 Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Popup (unchanged) */}
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
