import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config";
const token = localStorage.getItem("token");
// Fetch all geofences
export const fetchGeofences = createAsyncThunk(
  "geofence/fetchGeofences",
  async () => {
    const res = await axios.get(`${API_BASE_URL}/geofences`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  }
);

// Fetch all alerts
export const fetchAlerts = createAsyncThunk(
  "geofence/fetchAlerts",
  async () => {
    const res = await axios.get(`${API_BASE_URL}/geofences/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  }
);

// Simulate vehicle location check
export const checkVehicleLocation = createAsyncThunk(
  "geofence/checkVehicleLocation",
  async ({ vehicleId, lat, lng }) => {
    const res = await axios.post(
      `${API_BASE_URL}/geofences/check`,
      {
        vehicleId,
        lat,
        lng,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.alerts; // returns new alerts
  }
);

// Add new geofence
export const addGeofence = createAsyncThunk(
  "geofence/addGeofence",
  async ({ name, vehicleId, center, radius }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/geofences`,
        { name, vehicleId, center, radius },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Geofence added successfully!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add geofence");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const geofenceSlice = createSlice({
  name: "geofence",
  initialState: {
    geofences: [],
    alerts: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Geofences
      .addCase(fetchGeofences.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGeofences.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.geofences = action.payload;
      })
      .addCase(fetchGeofences.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch Alerts
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      })

      // Check Vehicle Location
      .addCase(checkVehicleLocation.fulfilled, (state, action) => {
        // Merge new alerts
        state.alerts = [...action.payload, ...state.alerts];
      })

      // Add Geofence
      .addCase(addGeofence.fulfilled, (state, action) => {
        state.geofences.push(action.payload);
      });
  },
});

export const { clearAlerts } = geofenceSlice.actions;
export default geofenceSlice.reducer;
