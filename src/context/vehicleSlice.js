import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../config";

// ✅ Create Vehicle
export const createVehicle = createAsyncThunk(
  "vehicles/createVehicle",
  async (vehicleData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/vehicles/create`,
        vehicleData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Fetch Vehicles
export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.vehicles; // Adjust based on API response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editVehicle = createAsyncThunk(
  "vehicles/editVehicle",
  async (vehicleData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/vehicles/${vehicleData.id}`,
        vehicleData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  async (vehicleId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_BASE_URL}/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Create Vehicle
    builder.addCase(createVehicle.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createVehicle.fulfilled, (state, action) => {
      state.loading = false;
      state.vehicles.push(action.payload);
    });
    builder.addCase(createVehicle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Vehicles
    builder.addCase(fetchVehicles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVehicles.fulfilled, (state, action) => {
      state.loading = false;
      state.vehicles = action.payload;
    });
    builder.addCase(fetchVehicles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(editVehicle.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editVehicle.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.vehicles.findIndex(
        (v) => v._id === action.payload._id
      );
      if (index !== -1) {
        state.vehicles[index] = action.payload;
      }
    });
    builder.addCase(editVehicle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default vehicleSlice.reducer;
