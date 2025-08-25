import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles,  } from "../../context/vehicleSlice";
import { fetchUsers } from "../../context/userSlice";
import Button from "../../components/ui/Buttons/Button";
import toast from "react-hot-toast";
import AdminLayouts from "../../layout/AdminLayouts";

function AssignDriver() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vehicles } = useSelector((state) => state.vehicles);
  const { users } = useSelector((state) => state.users);

  const [vehicle, setVehicle] = useState(null);
  const [driverId, setDriverId] = useState("");
  const [driversList, setDriversList] = useState([]);

  // Fetch vehicles & users
  useEffect(() => {
    if (!vehicles.length) dispatch(fetchVehicles());
    if (!users.length) dispatch(fetchUsers());
  }, [dispatch, vehicles.length, users.length]);

  // Set vehicle
  useEffect(() => {
    const v = vehicles.find((v) => v._id === id);
    if (v) {
      setVehicle(v);
      setDriverId(v.assignedDriver?._id || "");
    }
  }, [vehicles, id]);

  // Set drivers list
  useEffect(() => {
    setDriversList(users.filter((u) => u.role === "driver"));
  }, [users]);

  // Assign driver safely
  const handleAssign = async () => {
    if (!driverId) {
      toast.error("Please select a driver before assigning.");
      return;
    }

    try {
      // await dispatch(assignDriver({ vehicleId: id, driverId })).unwrap();
      toast.success("Driver assigned successfully");
      navigate("/view-vehicles");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to assign driver");
    }
  };

  if (!vehicle) return <p className="p-6 text-gray-600">Loading vehicle...</p>;

  return (
    <AdminLayouts>
      <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-xl mt-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
          Assign Driver
        </h1>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">Vehicle:</p>
          <div className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
            <b className="text-gray-900">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </b>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">
            Select Driver
          </label>
          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
          >
            <option value="">-- No Driver --</option>
            {driversList.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver?.profile?.name || driver?.username || driver?.email}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate("/view-vehicles")}
          >
            Cancel
          </Button>
          <Button onClick={handleAssign} variant="primary">
            Assign Driver
          </Button>
        </div>
      </div>
    </AdminLayouts>
  );
}

export default AssignDriver;
