// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menu = [
    { name: "🏠 Home",            path: "/Home" },
    { name: "📊 Dashboard",       path: "/dashboard" },
    { name: "🔗 Kelola Terhubung",path: "/terhubung" },
    { name: "📅 Kelola Jadwal",   path: "/ibadah" },
    { name: "🖼️ Galeri Foto",     path: "/galeri" },
    { name: "📢 Pengumuman",      path: "/pengumuman" },
    { name: "▶ Live Streaming",   path: "/livestreaming" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="text-xl font-bold">🕊️ Gereja App</div>
        <div className="text-xs text-gray-400 mt-1">Panel Admin</div>
      </div>

      {/* Menu */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menu.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`block px-4 py-2 rounded-lg transition text-sm ${
              location.pathname === item.path
                ? "bg-teal-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* User info + Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="mb-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Masuk sebagai</p>
          <p className="text-sm text-white font-semibold mt-1 truncate">{user?.nama || user?.email}</p>
          <span className="inline-block mt-1 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;