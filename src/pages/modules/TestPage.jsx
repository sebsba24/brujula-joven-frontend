import { Link, useNavigate } from "react-router-dom";
import { useTestEngine } from "../../hooks/useTestEngine";
import { useState, useEffect } from "react";
import { guardarRespuestas, getPerfilByUsuario, eliminarRespuestasCuestionario } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import ConfirmModal from "../../components/ui/ConfirmModal";

// ==================== CONSTANTES ====================

const RASGO_NOMBRE = {
  R: "Realista",
  I: "Investigador",
  A: "Artístico",
  S: "Social",
  E: "Emprendedor",
  C: "Convencional",
};

const RASGO_COLOR = {
  R: "bg-orange-100 text-orange-700",
  I: "bg-blue-100 text-blue-700",
  A: "bg-pink-100 text-pink-700",
  S: "bg-teal-100 text-teal-700",
  E: "bg-emerald-100 text-emerald-700",
  C: "bg-violet-100 text-violet-700",
};

// ==================== PANTALLA: YA COMPLETADO ====================

function TestCompletado({ perfil, onSolicitarReinicio }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Test Vocacional</span>
      </div>

      <div className="card p-8 text-center mb-6">
        <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          ✅
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ya completaste el test vocacional</h1>
        <p className="text-gray-400 text-sm mb-6">
          Aquí está un resumen de tu perfil actual.
        </p>

        {/* Rasgo dominante */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-4">
          <p className="text-xs text-gray-400 mb-2">Perfil dominante</p>
          <span className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full ${RASGO_COLOR[perfil.dominante] || "bg-gray-100 text-gray-700"}`}>
            {RASGO_NOMBRE[perfil.dominante] || perfil.dominante}
          </span>
        </div>

        {/* Top 3 */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <p className="text-xs text-gray-400 mb-3">Tus 3 rasgos principales</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {perfil.top3.map((r, i) => (
              <div key={r} className="text-center">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${RASGO_COLOR[r] || "bg-gray-100"}`}>
                  #{i + 1} {RASGO_NOMBRE[r] || r}
                </span>
                <p className="text-xs text-gray-400 mt-1">{Math.round(perfil.perfil[r])}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/perfil" className="btn-primary">Ver perfil completo</Link>
          <button onClick={onSolicitarReinicio} className="btn-secondary">
            Realizar nuevamente
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== PÁGINA PRINCIPAL ====================

export default function TestPage() {
  const navigate   = useNavigate();
  const { token }  = useAuth();
  const user       = token ? jwtDecode(token) : null;

  // ── Estado de pre-verificación ──
  const [verificando,      setVerificando]      = useState(true);
  const [yaCompletado,     setYaCompletado]     = useState(false);
  const [perfilExistente,  setPerfilExistente]  = useState(null);
  const [modalAbierto,     setModalAbierto]     = useState(false);
  const [eliminando,       setEliminando]       = useState(false);

  // ── Estado del test ──
  const { loading, visibleQuestions, nextLevel, currentLevel, answerQuestion } = useTestEngine();

  const [answers, setAnswers] = useState({ nivel1: {}, nivel2: {}, nivel3: {} });
  const [guardando, setGuardando] = useState(false);

  // Verificar test cada vez que el token esté disponible
  useEffect(() => {
    if (!token) return           // token aún no cargado desde localStorage
    if (!user?.sub) { setVerificando(false); return; }
    setVerificando(true);
    getPerfilByUsuario(user.sub)
      .then(data => {
        setPerfilExistente(data);
        setYaCompletado(true);
        setVerificando(false);
      })
      .catch(() => setVerificando(false)); // 404 → no hay test previo
  }, [token]);

  // ── Handlers del test ──
  const handleLikertChange = (question, value) => {
    const key = `${question.rasgo}${question.id}`;
    setAnswers(prev => ({
      ...prev,
      [`nivel${currentLevel}`]: { ...prev[`nivel${currentLevel}`], [key]: value },
    }));
    answerQuestion(question, value);
  };

  const handleOptionChange = (question, option) => {
    const key = `${option.rasgo}${question.id}`;
    setAnswers(prev => ({
      ...prev,
      [`nivel${currentLevel}`]: { ...prev[`nivel${currentLevel}`], [key]: 5 },
    }));
    answerQuestion(question, option);
  };

  const obtenerRespuestas = () => ({
    id_usuario: user?.sub,
    respuestas: answers,
    estado: true,
  });

  const handleSubmit = async () => {
    const respondidas = visibleQuestions.filter(q => {
      if (q.tipo === "multiple") {
        return q.opciones?.some(opt => answers[`nivel${currentLevel}`][`${opt.rasgo}${q.id}`]);
      }
      return answers[`nivel${currentLevel}`][`${q.rasgo}${q.id}`];
    });

    if (respondidas.length < visibleQuestions.length) {
      alert("Responde todas las preguntas antes de continuar.");
      return;
    }

    if (currentLevel === 3) {
      setGuardando(true);
      try {
        await guardarRespuestas(obtenerRespuestas(), token);
        navigate("/perfil");
      } catch (error) {
        console.error("Error guardando:", error);
        alert("Error al guardar las respuestas. Inténtalo de nuevo.");
      } finally {
        setGuardando(false);
      }
      return;
    }

    nextLevel();
  };

  // ── Handlers del modal ──
  const handleSolicitarReinicio = () => setModalAbierto(true);

  const handleConfirmarReinicio = async () => {
    setEliminando(true);
    try {
      await eliminarRespuestasCuestionario(user.sub);
    } catch {
      // Si ya no existe, continuamos igual
    } finally {
      setEliminando(false);
      setModalAbierto(false);
      setYaCompletado(false);
      setPerfilExistente(null);
      setAnswers({ nivel1: {}, nivel2: {}, nivel3: {} });
    }
  };

  // ── Progreso ──
  const totalRespondidas = Object.values(answers[`nivel${currentLevel}`] || {}).length;
  const progress = visibleQuestions.length
    ? Math.min((totalRespondidas / visibleQuestions.length) * 100, 100)
    : 0;

  // ── Renders de estado ──
  if (verificando) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-400">
        Verificando tu progreso…
      </div>
    );
  }

  if (yaCompletado && perfilExistente) {
    return (
      <>
        <ConfirmModal
          open={modalAbierto}
          danger
          title="¿Realizar el test nuevamente?"
          message="Tus respuestas anteriores serán eliminadas permanentemente. Tendrás que completar los 3 niveles del test desde cero."
          confirmLabel="Sí, eliminar y reiniciar"
          cancelLabel="Cancelar"
          loading={eliminando}
          onConfirm={handleConfirmarReinicio}
          onCancel={() => setModalAbierto(false)}
        />
        <TestCompletado perfil={perfilExistente} onSolicitarReinicio={handleSolicitarReinicio} />
      </>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-400">
        Cargando preguntas…
      </div>
    );
  }

  // ── UI del test ──────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Test Vocacional</span>
      </div>

      {/* Título */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">🧭</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Vocacional</h1>
          <p className="text-gray-400 mt-1">Nivel {currentLevel} de 3</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* NIVEL 1 */}
      {currentLevel === 1 && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">Responde las siguientes preguntas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-2">Pregunta</th>
                  <th>Nunca</th><th>Casi nunca</th><th>A veces</th><th>Casi siempre</th><th>Siempre</th>
                </tr>
              </thead>
              <tbody>
                {visibleQuestions.map(q => {
                  const key = `${q.rasgo}${q.id}`;
                  return (
                    <tr key={q.id} className="border-b hover:bg-gray-50">
                      <td className="text-left py-3 px-2">{q.text}</td>
                      {[1, 2, 3, 4, 5].map(val => (
                        <td key={val}>
                          <input type="radio" name={key}
                            checked={answers[`nivel${currentLevel}`][key] === val}
                            onChange={() => handleLikertChange(q, val)} />
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
          {visibleQuestions.map(q => (
            <div key={q.id} className="bg-white shadow rounded-xl p-6">
              <p className="font-medium mb-4">{q.text}</p>
              <div className="flex flex-col gap-3">
                {q.opciones?.map(opt => {
                  const key = `${opt.rasgo}${q.id}`;
                  return (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name={q.id}
                        checked={answers[`nivel${currentLevel}`][key] === 5}
                        onChange={() => handleOptionChange(q, opt)} />
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
          <h2 className="text-lg font-semibold mb-4 text-center">Responde las siguientes preguntas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-2">Pregunta</th>
                  <th>Nunca</th><th>Casi nunca</th><th>A veces</th><th>Casi siempre</th><th>Siempre</th>
                </tr>
              </thead>
              <tbody>
                {visibleQuestions.map(q => {
                  const key = `${q.rasgo}${q.id}`;
                  return (
                    <tr key={q.id} className="border-b hover:bg-gray-50">
                      <td className="text-left py-3 px-2">{q.text}</td>
                      {[1, 2, 3, 4, 5].map(val => (
                        <td key={val}>
                          <input type="radio" name={key}
                            checked={answers[`nivel${currentLevel}`][key] === val}
                            onChange={() => handleLikertChange(q, val)} />
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

      {/* Botón continuar / finalizar */}
      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={guardando}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {guardando ? "Guardando…" : currentLevel === 3 ? "Finalizar" : "Continuar"}
        </button>
      </div>

    </div>
  );
}
