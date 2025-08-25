import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuBookPlus,
  LuSignpost,
  LuChartBar,
  LuUser,
  LuSettings,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import toast from "react-hot-toast";
import Button1 from "./ui/Buttons/Button1";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../context/userSlice";
import { fetchCurrentUser } from "../context/userSlice";

function Sidebar({ isOpen, setIsOpen }) {
  const { currentUser, loading, error } = useSelector((state) => state.users);
  const user = currentUser || JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  const logouthandle = () => {
    dispatch(logout());

    toast.success("Logout Successfully");
    navigate("/login");
  };

  const linkClass =
    "flex items-center gap-3 font-medium px-4 py-2 rounded-xl transition-all duration-300";

  const menuItems = [
    {
      label: "Dashboard",
      icon: <FaHome size={18} />,
      to: "/",
      roles: ["admin", "driver", "manager", "user"],
      section: "Main",
    },
    {
      label: user.role === "admin" ? "Add Driver/Manager" : "Add Driver",
      icon: <LuBookPlus size={18} />,
      to: "/add-driver",
      roles: ["admin", "manager"],
      section: "User Management",
    },
    {
      label: "View Users",
      icon: <LuSignpost size={18} />,
      to: "/view-users",
      roles: ["admin", "manager"],
      section: "User Management",
    },
    {
      label: "Add Vehicle",
      icon: <LuBookPlus size={18} />,
      to: "/add-vehicle",
      roles: ["admin", "manager"],
      section: "Vehicle Management",
    },
    {
      label: "View Vehicles",
      icon: <LuSignpost size={18} />,
      to: "/view-vehicles",
      roles: ["admin", "driver", "manager"],
      section: "Vehicle Management",
    },
    {
      label: "Add Trip",
      icon: <LuBookPlus size={18} />,
      to: "/add-trip",
      roles: ["admin", "manager", "user"],
      section: "Trip Management",
    },
    {
      label: "View Trips",
      icon: <LuSignpost size={18} />,
      to: "/view-trips",
      roles: ["admin", "manager", "driver"],
      section: "Trip Management",
    },
    {
      label: "View Trips",
      icon: <LuSignpost size={18} />,
      to: "/view-trips/user",
      roles: ["user"],
      section: "Trip Management",
    },
    {
      label: "Add GeoFence",
      icon: <LuBookPlus size={18} />,
      to: "/add-geo-fence",
      roles: ["admin", "manager", "driver"],
      section: "GeoFence Management",
    },
    {
      label: "GeoFence",
      icon: <LuSignpost size={18} />,
      to: "/geo-fence",
      roles: ["admin", "manager", "driver"],
      section: "GeoFence Management",
    },

    {
      label: "Maintenance",
      icon: <LuSignpost size={18} />,
      to: "/maintenance",
      roles: ["admin", "manager", "driver"],
      section: "Maintenance Management",
    },
    {
      label: "View Reports",
      icon: <LuSignpost size={18} />,
      to: "/admin/view-reports",
      roles: ["admin", "manager"],
      section: "Reports",
    },
    {
      label: "Summary",
      icon: <LuChartBar size={18} />,
      to: "/summary",
      roles: ["admin", "manager"],
      section: "Reports",
    },
    {
      label: "Accounts",
      icon: <LuUser size={18} />,
      to: "/profile",
      roles: ["admin", "manager", "driver", "user"],
      section: "Profile",
    },
    {
      label: "Settings",
      icon: <LuSettings size={18} />,
      to: "/settings",
      roles: ["admin"],
      section: "Configuration",
    },
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <div
      className={`h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white flex flex-col shadow-2xl transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Profile */}
      <div className="flex flex-col items-center text-center p-4 border-b border-gray-700 relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 right-3 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition"
        >
          {isOpen ? <LuChevronLeft /> : <LuChevronRight />}
        </button>
        <img
          className="h-14 w-14 rounded-full border-2 border-[#ffe6c9] shadow-lg"
          src={
            user?.profilePic ||
            "https://static.vecteezy.com/system/resources/previews/002/002/403/large_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
          }
          alt="user"
        />
        {isOpen && (
          <>
            <h2 className="text-lg font-bold mt-2">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-4 px-2 custom-scrollbar space-y-6">
        {Object.keys(groupedItems).map((section, idx) => {
          const items = groupedItems[section].filter((item) =>
            item.roles.includes(user.role)
          );
          if (!items.length) return null;

          return (
            <div key={idx}>
              {isOpen && (
                <p className="text-gray-400 uppercase text-xs px-4 mb-2">
                  {section}
                </p>
              )}
              {items.map((item, index) => {
                const isActive = window.location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={index}
                    to={item.to}
                    className={({ isActive }) =>
                      `${linkClass} ${
                        isActive
                          ? "bg-[#ffe6c9] text-black shadow-md"
                          : "hover:bg-gray-700 hover:scale-[1.05]"
                      }`
                    }
                    end={item.to === "/"}
                  >
                    {item.icon} {isOpen && item.label}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <Button1 onClick={logouthandle}>{isOpen && "Logout"}</Button1>
      </div>
    </div>
  );
}

export default Sidebar;
