import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../config";

// Create User (Admin endpoint, requires token)
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE_URL}/users/create`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Register User (Public endpoint, no token required)
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/users/register`, userData);
      return res.data; // { success, message, user, token }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Login User (Public endpoint, no token required)
export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, userData);
      return res.data; // { success, message, user, token }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch All Users (Requires token)
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/users/getAllUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch Current User (Requires token)
export const fetchCurrentUser = createAsyncThunk(
  "users/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update User (Requires token)
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/users/edit/${id}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete User (Requires token)
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    // Create User
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users.push(action.payload);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Register User
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.users.push(action.payload.user);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Login User
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Current User
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update User
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) state.users[index] = action.payload;
      if (state.currentUser?._id === action.payload._id) {
        state.currentUser = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete User
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter((u) => u._id !== action.payload);
      if (state.currentUser?._id === action.payload) {
        state.currentUser = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
