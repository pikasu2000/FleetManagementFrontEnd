import { configureStore } from "@reduxjs/toolkit";
import vehicleReducer from "../context/vehicleSlice";
import userReducer from "../context/userSlice";
import tripReducer from "../context/tripSlice";
const store = configureStore({
  reducer: {
    vehicles: vehicleReducer,
    users: userReducer,
    trips: tripReducer,
  },
});

export default store;
