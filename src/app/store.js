import { configureStore } from "@reduxjs/toolkit";
import vehicleReducer from "../context/vehicleSlice";
import userReducer from "../context/userSlice";
import tripReducer from "../context/tripSlice";
import geoFenceReducer from "../context/geoFenceSlice";
import maintenanceReducer from "../context/maintenanceSlice";

const store = configureStore({
  reducer: {
    vehicles: vehicleReducer,
    users: userReducer,
    trips: tripReducer,
    geoFences: geoFenceReducer,
    maintenance: maintenanceReducer,
  },
});

export default store;
