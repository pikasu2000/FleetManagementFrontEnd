import React, { useEffect, useState } from "react";
import AdminLayouts from "../../layout/AdminLayouts";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../../context/userSlice";

function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.users);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading || !currentUser) {
    return (
      <AdminLayouts>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </AdminLayouts>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "settings", label: "Settings" },
    { id: "activity", label: "Activity" },
  ];

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AdminLayouts>
      <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">
        <div className="w-full max-w-3xl flex flex-col">
          {/* Profile Card */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl rounded-3xl p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={
                  currentUser.profilePic ||
                  "https://static.vecteezy.com/system/resources/previews/002/002/403/large_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">
              {currentUser.profile?.name || currentUser.name}
            </h2>
            <p className="text-white/80 text-sm mt-1">{currentUser.email}</p>
            <span className="mt-3 inline-block px-4 py-1 text-xs font-semibold bg-white/30 text-white rounded-full shadow backdrop-blur-sm">
              {currentUser.role || "Driver"}
            </span>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 text-sm font-medium text-white bg-white/30 rounded-full hover:bg-white/50 transition">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col backdrop-blur-sm">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[100px] py-2 text-center font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-indigo-100/70 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50/70"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Animated Tab Content */}
            <div className="p-4 max-h-[400px] overflow-y-auto relative">
              <AnimatePresence exitBeforeEnter>
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4 text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Phone:</span>
                        <span>{currentUser.phone || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Location:</span>
                        <span>{currentUser.location || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Joined:</span>
                        <span>{currentUser.joinedAt?.split("T")[0]}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4 text-gray-700">
                      <form className="flex flex-col gap-3">
                        <input
                          type="text"
                          defaultValue={currentUser.name}
                          placeholder="Full Name"
                          className="border p-2 rounded-lg"
                        />
                        <input
                          type="email"
                          defaultValue={currentUser.email}
                          placeholder="Email Address"
                          className="border p-2 rounded-lg"
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          className="border p-2 rounded-lg"
                        />
                        <div className="flex justify-end gap-3 mt-2">
                          <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
                            Cancel
                          </button>
                          <button className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition">
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {activeTab === "activity" && (
                  <motion.div
                    key="activity"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2 text-gray-700 text-sm">
                      <p>• Logged in recently</p>
                      <p>• Updated profile</p>
                      <p>• Changed password</p>
                      <p>• Logged in from Mobile App</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AdminLayouts>
  );
}

export default Profile;
