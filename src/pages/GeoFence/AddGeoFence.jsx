import React, { useState, useEffect, useRef } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "../../context/vehicleSlice";
import { addGeofence } from "../../context/geoFenceSlice";
import toast from "react-hot-toast";
import Button from "../../components/ui/Buttons/Button";

const AddGeofence = () => {
  const dispatch = useDispatch();
  const { vehicles } = useSelector((state) => state.vehicles);
  const contentRef = useRef(null); // persistent scroll

  const [form, setForm] = useState({
    name: "",
    vehicleId: "",
    lat: "",
    lng: "",
    radius: "",
  });

  useEffect(() => {
    if (!vehicles?.length) dispatch(fetchVehicles());
  }, [dispatch, vehicles]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.vehicleId ||
      !form.lat ||
      !form.lng ||
      !form.radius
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    const scrollPos = contentRef.current.scrollTop; // save scroll

    try {
      await dispatch(
        addGeofence({
          name: form.name,
          vehicleId: form.vehicleId,
          center: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) },
          radius: parseFloat(form.radius),
        })
      ).unwrap();

      toast.success("Geofence added successfully!");
      setForm({ name: "", vehicleId: "", lat: "", lng: "", radius: "" });

      contentRef.current.scrollTop = scrollPos; // restore scroll
    } catch (err) {
      toast.error(err?.message || "Failed to add geofence");
    }
  };

  return (
    <AdminLayouts>
      <div
        ref={contentRef}
        className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6">Add Geofence</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-semibold">Geofence Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Vehicle</label>
            <select
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select Vehicle</option>
              {vehicles?.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name || v.licensePlate}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Latitude</label>
              <input
                type="number"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Longitude</label>
              <input
                type="number"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Radius (meters)</label>
            <input
              type="number"
              value={form.radius}
              onChange={(e) => setForm({ ...form, radius: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Add Geofence
            </Button>
          </div>
        </form>
      </div>
    </AdminLayouts>
  );
};

export default AddGeofence;
