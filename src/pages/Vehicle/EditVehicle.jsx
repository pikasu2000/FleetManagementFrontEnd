import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles, editVehicle } from "../../context/vehicleSlice";
import { fetchUsers } from "../../context/userSlice";
import Button from "../../components/ui/Buttons/Button";
import toast from "react-hot-toast";
import AdminLayouts from "../../layout/AdminLayouts";

function EditVehicle() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vehicles } = useSelector((state) => state.vehicles);
  const { users } = useSelector((state) => state.users);

  const [vehicle, setVehicle] = useState(null);
  const [driversList, setDriversList] = useState([]);

  useEffect(() => {
    dispatch(fetchVehicles());
    if (!users.length) dispatch(fetchUsers());
  }, [dispatch, users.length]);

  useEffect(() => {
    const v = vehicles.find((v) => v._id === id);
    if (v) setVehicle({ ...v, assignedDriver: v.assignedDriver?._id || "" });
  }, [vehicles, id]);

  useEffect(() => {
    setDriversList(users.filter((u) => u.role === "driver"));
  }, [users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        mileage: vehicle.mileage,
        status: vehicle.status,
        assignedDriver: vehicle.assignedDriver || null,
        location: vehicle.location || "",
      };
      await dispatch(editVehicle({ id, data: updatedData })).unwrap();
      toast.success("Vehicle updated successfully");
      navigate("/view-vehicles");
    } catch (err) {
      toast.error(err?.message || "Failed to update vehicle");
    }
  };

  if (!vehicle) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <AdminLayouts>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8 transition-transform transform hover:scale-[1.01]">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
            Edit Vehicle
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two-inline inputs: Make & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["make", "model"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={vehicle[field] || ""}
                    onChange={(e) =>
                      setVehicle({ ...vehicle, [field]: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </div>
              ))}
            </div>

            {/* Two-inline inputs: Year & Mileage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["year", "mileage"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type="number"
                    value={vehicle[field] || ""}
                    onChange={(e) =>
                      setVehicle({
                        ...vehicle,
                        [field]: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </div>
              ))}
            </div>

            {/* Two-inline inputs: License Plate & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["licensePlate", "location"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={vehicle[field] || ""}
                    onChange={(e) =>
                      setVehicle({ ...vehicle, [field]: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </div>
              ))}
            </div>

            {/* Status & Assigned Driver */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={vehicle.status || "active"}
                  onChange={(e) =>
                    setVehicle({ ...vehicle, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              {/* Assigned Driver */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Assigned Driver
                </label>
                <select
                  value={vehicle.assignedDriver || ""}
                  onChange={(e) =>
                    setVehicle({ ...vehicle, assignedDriver: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                  <option value="">No Driver</option>
                  {driversList.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver?.profile?.name || driver?.username || driver?.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                onClick={() => navigate("/view-vehicles")}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayouts>
  );
}

export default EditVehicle;
