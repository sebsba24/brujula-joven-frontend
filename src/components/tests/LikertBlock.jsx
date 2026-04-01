import { useState } from "react";

export default function LikertBlock({ questions, onSubmit }) {
  const [answers, setAnswers] = useState({});

  const handleChange = (id, value) => {
    setAnswers({
      ...answers,
      [id]: value
    });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Responde todas las preguntas");
      return;
    }

    onSubmit(answers);
  };

  return (
    <div className="card p-6 mb-8 bg-navy-900 border-0">

      {/* TÍTULO */}
      <h2 className="text-xl font-bold mb-6 text-center">
        Responde las siguientes preguntas
      </h2>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse">

          {/* ENCABEZADO */}
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Pregunta</th>
              <th>Nunca</th>
              <th>Casi nunca</th>
              <th>A veces</th>
              <th>Casi siempre</th>
              <th>Siempre</th>
            </tr>
          </thead>

          {/* CUERPO */}
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-b">

                {/* TEXTO */}
                <td className="text-left py-3 pr-4">
                  {q.text}
                </td>

                {/* RADIOS */}
                {[1,2,3,4,5].map((val) => (
                  <td key={val}>
                    <input
                      type="radio"
                      name={`${q.rasgo}${q.id}`}
                      onChange={() => handleChange(q.id, val)}
                    />
                  </td>
                ))}

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* BOTÓN */}
      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600"
        >
          Siguiente
        </button>
      </div>

    </div>
  );
}