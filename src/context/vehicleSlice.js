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
      console.log("Fetched Vehicles:", res.data.vehicles);
      return res.data.vehicles;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchVehiclesById = createAsyncThunk(
  "vehicles/fetchVehiclesById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.vehicle;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editVehicle = createAsyncThunk(
  "vehicles/editVehicle",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_BASE_URL}/vehicles/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    selectedVehicle: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehiclesById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedVehicle = null;
      })
      .addCase(fetchVehiclesById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVehicle = action.payload;
      })
      .addCase(fetchVehiclesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Create Vehicle ---
    builder
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles.push(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Fetch Vehicles ---
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Edit Vehicle ---
    builder
      .addCase(editVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editVehicle.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVehicle = action.payload;

        // Update in vehicles array
        const index = state.vehicles.findIndex(
          (v) => v._id === updatedVehicle._id
        );
        if (index !== -1) state.vehicles[index] = updatedVehicle;

        // Update selectedVehicle if it matches
        if (state.selectedVehicle?._id === updatedVehicle._id) {
          state.selectedVehicle = updatedVehicle;
        }
      })
      .addCase(editVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Delete Vehicle ---
    builder
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = state.vehicles.filter(
          (v) => v._id !== action.payload._id
        );

        // Clear selectedVehicle if deleted
        if (state.selectedVehicle?._id === action.payload._id) {
          state.selectedVehicle = null;
        }
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default vehicleSlice.reducer;
