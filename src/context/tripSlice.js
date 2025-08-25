import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../config";

// Fetch trips all
export const fetchAllTrips = createAsyncThunk(
  "trips/fetchAllTrips",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/trips/view/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.trips || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUserTrips = createAsyncThunk(
  "trips/fetchUserTrips",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/trips/view/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.trips || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchDriverTrips = createAsyncThunk(
  "trips/fetchDriverTrips",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/trips/view/driver`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.trips || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create trip
export const createTrip = createAsyncThunk(
  "trips/createTrip",
  async (tripData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE_URL}/trips/create`, tripData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.userTrips;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update trip (assign driver / respond)
export const updateTrip = createAsyncThunk(
  "trips/updateTrip",
  async ({ tripId, driverId, action, updates }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      let body = {};
      if (driverId) body.driverId = driverId; // Assign driver
      if (action) body.action = action; // Driver accept/reject
      if (updates) body.updates = updates; // Admin/User updates

      const res = await axios.put(
        `${API_BASE_URL}/trips/update/${tripId}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data.trip;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete trip
export const deleteTrip = createAsyncThunk(
  "trips/deleteTrip",
  async (tripId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/trips/delete/${tripId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return tripId;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const tripSlice = createSlice({
  name: "trips",
  initialState: {
    trips: [],
    userTrips: [],
    driverTrips: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch trips
      .addCase(fetchAllTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchAllTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDriverTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.driverTrips = action.payload;
      })
      .addCase(fetchDriverTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.userTrips = action.payload;
      })
      .addCase(fetchUserTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create trip
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.unshift(action.payload); // add new trip at top
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update trip
      .addCase(updateTrip.fulfilled, (state, action) => {
        const index = state.trips.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.trips[index] = action.payload;
      })

      // Delete trip
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter((t) => t._id !== action.payload);
      })
      .addCase("trips/socketUpdateTrip", (state, action) => {
        const index = state.trips.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.trips[index] = action.payload;
        else state.trips.unshift(action.payload); // add new trip if not exists
      });
  },
});

export default tripSlice.reducer;
