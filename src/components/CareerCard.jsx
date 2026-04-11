export default function CareerCard({ carrera }) {
  return (
    <div className="min-w-[220px] bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
      
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        {carrera.nombre}
      </h3>

      <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${carrera.afinidad}%` }}
        />
      </div>

      <p className="text-sm text-gray-600">
        Afinidad: {carrera.afinidad}%
      </p>
    </div>
  );
}