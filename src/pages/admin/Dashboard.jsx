import React from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import AdminLayouts from "../../layout/AdminLayouts";

function Dashboard() {
  return (
    <AdminLayouts>
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

        {/* Example Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Total Drivers</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">120</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Total Managers</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">15</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Pending Requests</h2>
            <p className="text-3xl font-bold text-red-600 mt-2">8</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✔️ Driver John Doe added successfully</li>
            <li>✔️ Manager Alex updated his profile</li>
            <li>❌ Pending approval for Driver Michael</li>
          </ul>
        </div>
      </main>
    </AdminLayouts>
  );
}

export default Dashboard;
