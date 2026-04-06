import { Link } from "react-router-dom";
import { useTestEngine } from "../../hooks/useTestEngine";
import { useState } from "react";
import { guardarRespuestas } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function TestPage() {

  const { token } = useAuth();
  const user = token ? jwtDecode(token) : null;


  const {
    loading,
    visibleQuestions,
    nextLevel,
    currentLevel,
    answerQuestion
  } = useTestEngine();

  const [answers, setAnswers] = useState({
    nivel1: {},
    nivel2: {},
    nivel3: {}
  });

  // progreso calculado aquí
  const progress = visibleQuestions.length
    ? (Object.keys(answers).length / visibleQuestions.length) * 100
    : 0;

  if (loading) {
    return <div>Cargando preguntas...</div>;
  }

  // =========================
  // RESPUESTA NIVEL 1 y 3 (LIKERT)
  // =========================
  const handleLikertChange = (question, value) => {
    const key = `${question.rasgo}${question.id}`;

    setAnswers(prev => ({
      ...prev,
      [`nivel${currentLevel}`]: {
        ...prev[`nivel${currentLevel}`],
        [key]: value
      }
    }));

    answerQuestion(question, value);
  };

  // =========================
  // RESPUESTA NIVEL 2 (OPCIONES)
  // =========================
  const handleOptionChange = (question, option) => {
    const key = `${option.rasgo}${question.id}`;

    setAnswers(prev => ({
      ...prev,
      [`nivel${currentLevel}`]: {
        ...prev[`nivel${currentLevel}`],
        [key]: 5
      }
    }));


    // correcto
    answerQuestion(question, option);
  };

  // =========================
  // ARMAR JSON FINAL
  // =========================
  const obtenerRespuestas = () => {
    return {
      id_usuario: user?.sub,
      respuestas: answers,
      estado: true
    };
  };

  // =========================
  // VALIDACIÓN + FLUJO
  // =========================
  const handleSubmit = async () => {

    const respondidas = visibleQuestions.filter(q => {

      if (q.tipo === "multiple") {
        // buscar si alguna opción fue seleccionada
        return q.opciones?.some(opt => {
          const key = `${opt.rasgo}${q.id}`;
          return answers[`nivel${currentLevel}`][key];
        });
      }

      // likert
      const key = `${q.rasgo}${q.id}`;
      return answers[`nivel${currentLevel}`][key];
    });

    if (respondidas.length < visibleQuestions.length) {
      alert("Responde todas las preguntas");
      return;
    }

    // Si es el último nivel → guardar
    if (currentLevel === 3) {
      const data = obtenerRespuestas();

      try {
        await guardarRespuestas(data, token);
        alert("Guardado exitoso");

        const navigate = useNavigate();
        navigate("/");


      } catch (error) {
        console.error("Error guardando:", error);
        alert("Error al guardar respuestas");
      }

      return;
    }

    nextLevel();
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* MIGA DE PAN */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Test</span>
      </div>

      {/* TÍTULO */}
      <h1 className="text-2xl font-bold mb-2">
        Test Vocacional
      </h1>

      <p className="text-gray-500 mb-4">
        Nivel {currentLevel}
      </p>

      {/* PROGRESO */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* NIVEL 1 */}
      {currentLevel === 1 && (
        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="text-lg font-semibold mb-4 text-center">
            Responde las siguientes preguntas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-2">Pregunta</th>
                  <th>Nunca</th>
                  <th>Casi nunca</th>
                  <th>A veces</th>
                  <th>Casi siempre</th>
                  <th>Siempre</th>
                </tr>
              </thead>

              <tbody>
                {visibleQuestions.map((q) => {
                  const key = `${q.rasgo}${q.id}`;

                  return (
                    <tr key={q.id} className="border-b hover:bg-gray-50">
                      <td className="text-left py-3 px-2">
                        {q.text}
                      </td>

                      {[1, 2, 3, 4, 5].map(val => (
                        <td key={val}>
                          <input
                            type="radio"
                            name={key}
                            checked={answers[`nivel${currentLevel}`][key] === val}
                            onChange={() => handleLikertChange(q, val)}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* NIVEL 2 */}
      {currentLevel === 2 && (
        <div className="space-y-6">

          {visibleQuestions.map((q) => (
            <div key={q.id} className="bg-white shadow rounded-xl p-6">

              <p className="font-medium mb-4">
                {q.text}
              </p>

              <div className="flex flex-col gap-3">
                {q.opciones?.map((opt) => {
                  const key = `${opt.rasgo}${q.id}`;

                  return (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[`nivel${currentLevel}`][key] === 5}
                        onChange={() => handleOptionChange(q, opt)}
                      />
                      {opt.text}
                    </label>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* NIVEL 3 */}
      {currentLevel === 3 && (
        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="text-lg font-semibold mb-4 text-center">
            Responde las siguientes preguntas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-2">Pregunta</th>
                  <th>Nunca</th>
                  <th>Casi nunca</th>
                  <th>A veces</th>
                  <th>Casi siempre</th>
                  <th>Siempre</th>
                </tr>
              </thead>

              <tbody>
                {visibleQuestions.map((q) => {
                  const key = `${q.rasgo}${q.id}`;

                  return (
                    <tr key={q.id} className="border-b hover:bg-gray-50">
                      <td className="text-left py-3 px-2">
                        {q.text}
                      </td>

                      {[1, 2, 3, 4, 5].map(val => (
                        <td key={val}>
                          <input
                            type="radio"
                            name={key}
                            checked={answers[`nivel${currentLevel}`][key] === val}
                            onChange={() => handleLikertChange(q, val)}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* BOTÓN */}
      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {currentLevel === 3 ? "Finalizar" : "Continuar"}
        </button>
      </div>

    </div>
  );
}
