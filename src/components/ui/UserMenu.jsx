import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");

        if (stored && stored !== "undefined") {
        try {
            setUser(JSON.parse(stored));
        } catch (e) {
            console.error("Error parseando user:", e);
            localStorage.removeItem("user");
        }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
    >
        <div className="flex items-center gap-2 cursor-pointer">
        {/* ICONO */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg">
            👤
        </div>

        {/* NOMBRE */}
        <span className="text-sm font-medium text-gray-700">
            {user.nombre}
        </span>
        </div>

        {/* MENÚ */}
        {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl p-2 z-50">
            <button
            onClick={() => navigate("/perfil")}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg"
            >
            Perfil
            </button>

            <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 hover:bg-red-100 text-red-600 rounded-lg"
            >
            Cerrar sesión
            </button>
        </div>
        )}
    </div>
    );
}