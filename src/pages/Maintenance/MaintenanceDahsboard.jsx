import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMaintenance,
  addMaintenance,
  completeMaintenance,
} from "../../context/maintenanceSlice";
import { fetchVehicles } from "../../context/vehicleSlice";
import AdminLayouts from "../../layout/AdminLayouts";

const MaintenanceDashboard = () => {
  const dispatch = useDispatch();
  const { schedules, loading, error } = useSelector(
    (state) => state.maintenance
  );
  const { vehicles } = useSelector((state) => state.vehicles);

  const [form, setForm] = useState({
    vehicleId: "",
    type: "",
    dueDate: "",
    mileageDue: "",
    notes: "",
  });

  useEffect(() => {
    dispatch(fetchMaintenance());
    dispatch(fetchVehicles());
  }, [dispatch]);

  const handleAdd = () => {
    if (form.vehicleId && form.type && form.dueDate) {
      dispatch(addMaintenance(form));
      setForm({
        vehicleId: "",
        type: "",
        dueDate: "",
        mileageDue: "",
        notes: "",
      });
    }
  };

  const handleComplete = (id) => {
    dispatch(completeMaintenance(id));
  };

  return (
    <AdminLayouts>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Maintenance Dashboard
            </h1>
          </div>

          {/* Add Maintenance Card */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Schedule Maintenance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <select
                className="border rounded-lg p-2"
                value={form.vehicleId}
                onChange={(e) =>
                  setForm({ ...form, vehicleId: e.target.value })
                }
              >
                <option value="">Select Vehicle</option>
                {vehicles?.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name || v.licensePlate}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Type"
                className="border rounded-lg p-2"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
              <input
                type="date"
                className="border rounded-lg p-2"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
              <input
                type="number"
                placeholder="Mileage Due"
                className="border rounded-lg p-2"
                value={form.mileageDue}
                onChange={(e) =>
                  setForm({ ...form, mileageDue: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Notes"
                className="border rounded-lg p-2 col-span-full"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Add Maintenance
              </button>
            </div>
          </div>

          {/* Maintenance List */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Scheduled Maintenance
            </h2>

            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {schedules?.length === 0 ? (
              <p className="text-gray-600">No maintenance scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schedules?.map((s) => (
                  <div
                    key={s._id}
                    className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {`${s.vehicleId?.make || ""} ${
                          s.vehicleId?.model || ""
                        } (${s.vehicleId?.licensePlate || ""})` ||
                          "Unknown Vehicle"}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          s.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {s.completed ? "Completed" : "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {s.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Due Date:</span>{" "}
                      {new Date(s.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Mileage Due:</span>{" "}
                      {s.mileageDue || "-"}
                    </p>
                    {s.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Notes:</span> {s.notes}
                      </p>
                    )}
                    {!s.completed && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleComplete(s._id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayouts>
  );
};

export default MaintenanceDashboard;
