import { Link } from "react-router-dom";
import { useTestEngine } from "../../hooks/useTestEngine";
import { useState } from "react";

export default function TestPage() {

  const {
    loading,
    visibleQuestions,
    answerQuestion,
    nextLevel,
    currentLevel,
    progress,
    isFinished,
    scores,
    buildResult
  } = useTestEngine();

  const [localAnswers, setLocalAnswers] = useState({});

  if (loading) {
    return <div>Cargando preguntas...</div>;
  }

  // =========================
  // MANEJO DE RESPUESTAS
  // =========================
  const handleChange = (question, value) => {
    setLocalAnswers(prev => ({
      ...prev,
      [question.id]: value
    }));

    answerQuestion(question, value);
  };

  // =========================
  // VALIDAR ENVÍO
  // =========================
  const handleSubmitLevel = () => {
    const total = visibleQuestions.length;
    const answered = Object.keys(localAnswers).length;

    if (answered < total) {
      alert("Debes responder todas las preguntas antes de continuar");
      return;
    }

    setLocalAnswers({});
    nextLevel();
  };

  // =========================
  // RENDER RESULTADO FINAL
  // =========================
  if (isFinished) {
    const result = buildResult();

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Resultado</h1>

        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Puntajes:</h2>
          {Object.entries(scores).map(([k, v]) => (
            <div key={k}>
              {k}: {v}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================
  // UI PRINCIPAL
  // =========================
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Test</span>
      </div>

      <h1 className="text-2xl font-bold mb-2">
        Test Vocacional
      </h1>

      <p className="text-gray-500 mb-6">
        Nivel {currentLevel}
      </p>

      {/* PROGRESO */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* PREGUNTAS */}
      <div className="space-y-6">
        {visibleQuestions.map((q) => (
          <div key={q.id} className="p-4 border rounded-xl">
            <p className="mb-3 font-medium">{q.text}</p>

            {/* LIKERT 1–5 */}
            {q.tipo !== "multiple" && (
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(val => (
                  <label key={val} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={val}
                      checked={localAnswers[q.id] === val}
                      onChange={() => handleChange(q, val)}
                    />
                    {val}
                  </label>
                ))}
              </div>
            )}

            {/* OPCIÓN ÚNICA (multiple) */}
            {q.tipo === "multiple" && (
              <div className="flex flex-col gap-2">
                {visibleQuestions
                  .filter(opt => opt.grupo === q.grupo)
                  .map(opt => (
                    <label key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`grupo-${q.grupo}`}
                        value={opt.id}
                        checked={localAnswers[q.grupo] === opt.id}
                        onChange={() => {
                          setLocalAnswers(prev => ({
                            ...prev,
                            [q.grupo]: opt.id
                          }));

                          answerQuestion(opt, opt.valor || 5);
                        }}
                      />
                      {opt.text}
                    </label>
                  ))}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* BOTÓN SIGUIENTE */}
      <div className="mt-8">
        <button
          onClick={handleSubmitLevel}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Continuar
        </button>
      </div>

    </div>
  );
}