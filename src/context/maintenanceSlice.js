import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../config";

// Fetch maintenance schedules
export const fetchMaintenance = createAsyncThunk(
  "maintenance/fetchMaintenance",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/maintenance`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data.data;
  }
);

// Add new maintenance
export const addMaintenance = createAsyncThunk(
  "maintenance/addMaintenance",
  async (maintenanceData) => {
    const res = await axios.post(
      `${API_BASE_URL}/maintenance`,
      maintenanceData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res.data.data;
  }
);

// Mark as completed
export const completeMaintenance = createAsyncThunk(
  "maintenance/completeMaintenance",
  async (id) => {
    const res = await axios.put(
      `${API_BASE_URL}/maintenance/complete/${id}`,
      null,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res.data.data;
  }
);

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState: {
    schedules: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenance.fulfilled, (state, action) => {
        state.schedules = action.payload;
      })
      .addCase(addMaintenance.fulfilled, (state, action) => {
        state.schedules.push(action.payload);
      })
      .addCase(completeMaintenance.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) state.schedules[index] = action.payload;
      });
  },
});

export default maintenanceSlice.reducer;
