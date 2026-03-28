import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    tipo_documento: "",
    numero_documento: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Enviando registro:", form); 

    try {
      const response = await registerUser(form);

      console.log("Usuario creado:", response);

      alert("Registro exitoso");

      // redirigir a login
      navigate("/login");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 pt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <h1 className="text-2xl font-bold text-center mb-6">
          Crear cuenta
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            className="w-full p-3 border rounded-xl"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Correo"
            className="w-full p-3 border rounded-xl"
            onChange={handleChange}
          />

          <select
            name="tipo_documento"
            className="w-full p-3 border rounded-xl bg-white"
            onChange={handleChange}
          >
            <option value="">Tipo de documento</option>
            <option value="CC">Cédula de ciudadanía</option>
            <option value="TI">Tarjeta de identidad</option>
            <option value="CE">Cédula de extranjería</option>
            <option value="PAS">Pasaporte</option>
          </select>

          <input
            type="text"
            name="numero_documento"
            placeholder="Número de documento"
            className="w-full p-3 border rounded-xl"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full p-3 border rounded-xl"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  );
}