export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-start pt-20 justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <h1 className="text-xl font-bold text-center mb-6">
          Recuperar contraseña
        </h1>

        <input
          type="email"
          placeholder="Ingresa tu correo"
          className="w-full p-3 border rounded-xl mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
          Enviar enlace
        </button>

      </div>
    </div>
  );
}