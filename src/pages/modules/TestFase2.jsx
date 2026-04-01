import { useEffect, useState } from "react";

export default function TestFase2() {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  // traer preguntas del backend
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const res = await fetch("http://localhost:8000/preguntas/multiples");
        const data = await res.json();

        setPreguntas(data);
      } catch (error) {
        console.error("Error cargando preguntas:", error);
      }
    };

    fetchPreguntas();
  }, []);

  // manejar selección
  const handleSelect = (idPregunta, rasgo) => {
    setRespuestas((prev) => ({
      ...prev,
      [idPregunta]: rasgo
    }));
  };

  if (Object.keys(respuestas).length < preguntas.length) {
    alert("Debes responder todas las preguntas");
    return;
  }

  // calcular resultados
  const calcularResultados = () => {
    const scores = {
      R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
    };

    Object.values(respuestas).forEach((rasgo) => {
      scores[rasgo] += 5;
    });

    console.log("Resultados:", scores);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-xl font-bold mb-6">
        Fase 2 - Selecciona una opción por pregunta
      </h1>

      {preguntas.map((p) => (
        <div key={p.id} className="mb-6 bg-white p-4 rounded-xl shadow">

          {/* ENUNCIADO */}
          <h3 className="font-semibold mb-3">
            {p.enunciado}
          </h3>

          {/* OPCIONES */}
          {p.opciones.map((op) => (
            <label key={op.id} className="block mb-2 cursor-pointer">

              <input
                type="radio"
                name={`pregunta_${p.id}`} // 🔥 agrupa radios correctamente
                value={op.rasgo}
                onChange={() => handleSelect(p.id, op.rasgo)}
                className="mr-2"
              />

              {op.texto}
            </label>
          ))}

        </div>
      ))}

      {/* BOTÓN */}
      <button
        onClick={calcularResultados}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
      >
        Finalizar Fase 2
      </button>

    </div>
  );
}