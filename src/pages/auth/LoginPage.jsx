import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(form);

      console.log("LOGIN DATA:", data);
      
      // Guardar token y usuario
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Actualizar contexto (ESTO ES LA CLAVE)
      login(data.user);

      // Redirección SIN recargar
      navigate("/modulos");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    
    <div className="min-h-screen flex items-start pt-20 justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <h1 className="text-2xl font-bold text-center mb-6">
          Iniciar sesión
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>

          <Link to="/register" className="text-blue-500 hover:underline">
            Registrarse
          </Link>
        </div>

      </div>
    </div>
  );
}