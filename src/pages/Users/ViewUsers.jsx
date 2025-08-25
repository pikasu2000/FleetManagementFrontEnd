import React, { useEffect, useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../context/userSlice";
import Button from "../../components/ui/Buttons/Button";
import toast from "react-hot-toast";
import DeleteCard from "../../components/ui/Cards/DeleteCard";
import { useNavigate } from "react-router-dom";

function ViewUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.users);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter users
  useEffect(() => {
    let temp = [...users];

    if (currentUser.role === "manager") {
      temp = temp.filter((u) => u.role === "driver");
    }

    // Search filter
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
  }, [users, searchQuery, filterRole, currentUser.role]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Something went wrong";
      toast.error(errorMessage);
    }
  }, [error]);

  // Edit user
  const handleEdit = (user) => {
    navigate(`/edit-users/${user._id}`);
  };

  // Delete user
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

          {/* Role filter only for admin */}
          {currentUser.role === "admin" && (
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="driver">Driver</option>
            </select>
          )}
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
                {currentUser.role === "admin" ? (
                  <div className="space-x-3">
                    <Button
                      onClick={() => handleEdit(user)}
                      variant="secondary"
                    >
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(user)} variant="danger">
                      Delete
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Popup */}

      {/* Delete Popup */}
      {isDeletePopupOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <DeleteCard
            vehicle={selectedUser}
            onCancel={() => setIsDeletePopupOpen(false)}
            onConfirm={confirmDelete}
          />
        </div>
      )}
    </AdminLayouts>
  );
}

export default ViewUsers;
