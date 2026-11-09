import { Link } from "react-router-dom";
import { useTestEngine } from "../../hooks/useTestEngine";
import { useState, useEffect } from "react";
import { guardarRespuestas, getPerfilByUsuario, eliminarRespuestasCuestionario, getRecomendacionesByUsuario } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { Compass, CheckCircle2 } from 'lucide-react'

// ==================== COMPONENTE REUTILIZABLE ====================

const LIKERT_LABELS = ["Nunca", "Casi nunca", "A veces", "Casi siempre", "Siempre"];
const CIRCLE_SIZES = [36, 42, 48, 54, 62];

function LikertBubble({ question, selected, onChange }) {
  return (
    <div style={{
      background: 'var(--surf)',
      border: '1px solid var(--line)',
      borderRadius: 16,
      padding: '20px 24px',
      transition: 'box-shadow 0.15s',
    }}>
      <p style={{ font: '500 15px Archivo', color: 'var(--text)', marginBottom: 20, lineHeight: 1.5 }}>
        {question.text}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="likert-edge-label" style={{ font: '600 12px Archivo', color: 'var(--muted)', width: 82, flexShrink: 0, textAlign: 'right', lineHeight: 1.3 }}>
          Muy en<br />desacuerdo
        </span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
          {[1, 2, 3, 4, 5].map((val, i) => {
            const size = CIRCLE_SIZES[i];
            const isSelected = selected === val;
            return (
              <div key={val} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => onChange(question, val)}
                  title={LIKERT_LABELS[i]}
                  style={{
                    width: size, height: size,
                    borderRadius: '50%',
                    border: isSelected ? '2px solid var(--cyan)' : '2px solid var(--line)',
                    background: isSelected ? 'var(--cyan)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--cyan)'
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--line)'
                  }}
                >
                  {isSelected && (
                    <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12 L10 17 L19 7" />
                    </svg>
                  )}
                </button>
                <span style={{
                  font: '500 10px Archivo',
                  color: isSelected ? 'var(--cyandk)' : 'var(--sub)',
                  textAlign: 'center', lineHeight: 1.2, maxWidth: 60,
                }}>
                  {LIKERT_LABELS[i]}
                </span>
              </div>
            );
          })}
        </div>
        <span className="likert-edge-label" style={{ font: '600 12px Archivo', color: 'var(--green)', width: 82, flexShrink: 0, textAlign: 'left', lineHeight: 1.3 }}>
          Muy de<br />acuerdo
        </span>
      </div>
    </div>
  );
}

function LikertTable({ questions, answers, levelKey, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {questions.map(q => {
        const key = `${q.rasgo}${q.id}`;
        return (
          <LikertBubble
            key={q.id}
            question={q}
            selected={answers[levelKey]?.[key]}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
}

// ==================== CONSTANTES ====================

const RASGO_NOMBRE = {
  R: "Realista", I: "Investigativo", A: "Artístico",
  S: "Social",   E: "Emprendedor",  C: "Convencional",
};

const RASGO_BAR_COLOR = {
  I: 'var(--cyan)',    R: 'var(--green)',
  E: 'var(--violet)',  A: 'var(--sub)',
  S: 'var(--sub)',     C: 'var(--sub)',
};

const DONUT_COLORS = ['var(--lime)', 'var(--cyanbr)', 'var(--violet)'];

// ==================== PANTALLA: YA COMPLETADO (S3) ====================

function TestCompletado({ perfil, recomendaciones, onSolicitarReinicio }) {
  // Build sorted RIASEC entries
  const rasgosSorted = Object.entries(perfil.perfil || {})
    .sort(([, a], [, b]) => b - a);

  // Donut conic-gradient from top3
  const topVal = perfil.top3?.map(k => Math.round(perfil.perfil[k] || 0)) || [];
  const total = topVal.reduce((s, v) => s + v, 0) || 100;
  const pct0 = Math.round((topVal[0] || 0) / total * 100);
  const pct1 = Math.round((topVal[1] || 0) / total * 100);
  const pct2 = Math.round((topVal[2] || 0) / total * 100);
  const donut = `conic-gradient(
    var(--lime)   0 ${pct0}%,
    var(--cyanbr) ${pct0}% ${pct0 + pct1}%,
    var(--violet) ${pct0 + pct1}% ${pct0 + pct1 + pct2}%,
    rgba(255,255,255,.18) ${pct0 + pct1 + pct2}% 100%
  )`;
  const topPct = Math.round(perfil.perfil?.[perfil.dominante] || 0);
  const dominanteName = `${perfil.top3?.map(k => RASGO_NOMBRE[k]).join('-') || ''}`;

  // Career cards from recomendaciones
  const careerCards = [
    recomendaciones?.principal,
    ...(recomendaciones?.secundarias || []).slice(0, 2),
  ].filter(Boolean);

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      {/* Navy header */}
      <div style={{
        background: 'var(--navy)', color: '#fff',
        padding: '40px 44px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -40, top: -60,
          width: 260, height: 260,
          background: 'radial-gradient(circle, rgba(134,224,90,.22), transparent 70%)',
        }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ color: 'var(--lime)', font: '700 12px Archivo', letterSpacing: '.14em', textTransform: 'uppercase' }}>
              Tu perfil vocacional
            </div>
            <h1 style={{ font: '800 30px/1.2 Archivo', letterSpacing: '-.02em', margin: '12px 0 8px' }}>
              Eres un perfil <span style={{ color: 'var(--cyanbr)' }}>{dominanteName}</span>
            </h1>
            <p style={{ font: '500 14px/1.5 Archivo', color: 'rgba(255,255,255,.72)', maxWidth: 500, margin: 0 }}>
              Te mueve entender cómo funcionan las cosas y construir soluciones concretas.
              Las áreas más afines a tu perfil son tu mejor terreno.
            </p>
          </div>
          {/* Donut chart */}
          <div style={{
            width: 150, height: 150, borderRadius: '50%',
            background: donut,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{
              width: 104, height: 104, borderRadius: '50%',
              background: 'var(--navy)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ font: '800 26px Archivo', color: '#fff' }}>{topPct}%</span>
              <span style={{ font: '500 11px Archivo', color: 'rgba(255,255,255,.6)' }}>afinidad top</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '34px 44px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 38 }}>
        {/* Left: RIASEC bars */}
        <div>
          <div style={{ font: '800 17px Archivo', marginBottom: 18 }}>Tus áreas de interés</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {rasgosSorted.map(([key, val]) => {
              const pct = Math.round(val)
              const color = RASGO_BAR_COLOR[key] || 'var(--sub)'
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', font: '700 13px Archivo', marginBottom: 6 }}>
                    <span>{RASGO_NOMBRE[key] || key}</span>
                    <span style={{ color }}>{pct}%</span>
                  </div>
                  <div style={{ height: 9, background: 'var(--bg)', borderRadius: 99 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Career cards */}
        <div>
          <div style={{ font: '800 17px Archivo', marginBottom: 18 }}>Carreras que encajan</div>
          {careerCards.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {careerCards.map((carrera, i) => {
                const colors = [
                  { bg: 'rgba(21,166,204,.12)', color: 'var(--cyandk)' },
                  { bg: 'rgba(47,190,87,.14)', color: 'var(--greendk)' },
                  { bg: 'rgba(107,91,230,.13)', color: 'var(--violetdk)' },
                ]
                const c = colors[i] || colors[2]
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    border: '1px solid var(--line)', borderRadius: 13, padding: 14,
                  }}>
                    <div style={{
                      width: 46, height: 46, flexShrink: 0, borderRadius: 11,
                      background: c.bg, color: c.color,
                      font: '800 18px Archivo',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: '700 14px Archivo' }}>{carrera}</div>
                      <div style={{ font: '500 12px Archivo', color: 'var(--muted)', marginTop: 2 }}>
                        {i === 0 ? 'Alta empleabilidad' : i === 1 ? 'En crecimiento' : 'Vía rápida al empleo'}
                      </div>
                    </div>
                    <span style={{ font: '800 14px Archivo', color: 'var(--green)' }}>
                      {Math.round(perfil.perfil?.[perfil.top3?.[i]] || rasgosSorted[i]?.[1] || 80)}%
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{
              border: '1px dashed var(--line)', borderRadius: 13, padding: '28px 20px',
              textAlign: 'center', color: 'var(--muted)', font: '500 13px Archivo',
            }}>
              Completa los demás módulos para ver recomendaciones personalizadas.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '0 44px 40px', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <Link to="/modulos/educacion" style={{
          border: 0, background: 'var(--cyan)', color: '#fff',
          font: '800 15px Archivo', padding: '15px 26px', borderRadius: 12,
          cursor: 'pointer', textDecoration: 'none',
        }}>
          Explorar estas carreras
        </Link>
        <button
          onClick={onSolicitarReinicio}
          style={{
            border: '1px solid var(--line)', background: '#fff', color: 'var(--text)',
            font: '700 15px Archivo', padding: '15px 26px', borderRadius: 12, cursor: 'pointer',
          }}
        >
          Realizar nuevamente
        </button>
      </div>
    </div>
  )
}

// ==================== PÁGINA PRINCIPAL ====================

export default function TestPage() {
  const { token }  = useAuth();
  const user       = token ? jwtDecode(token) : null;

  // ── Estado de pre-verificación ──
  const [verificando,      setVerificando]      = useState(true);
  const [yaCompletado,     setYaCompletado]     = useState(false);
  const [perfilExistente,  setPerfilExistente]  = useState(null);
  const [recomendaciones,  setRecomendaciones]  = useState(null);
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
    Promise.all([
      getPerfilByUsuario(user.sub),
      getRecomendacionesByUsuario(user.sub).catch(() => null),
    ]).then(([perfilData, recomData]) => {
      setPerfilExistente(perfilData);
      if (recomData?.recomendaciones) setRecomendaciones(recomData.recomendaciones);
      setYaCompletado(true);
      setVerificando(false);
    }).catch(() => setVerificando(false)); // 404 → no hay test previo
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
    const newKey = `${option.rasgo}${option.id}`;
    setAnswers(prev => {
      const levelAnswers = { ...prev[`nivel${currentLevel}`] };
      question.opciones?.forEach(opt => {
        delete levelAnswers[`${opt.rasgo}${opt.id}`];
      });
      levelAnswers[newKey] = 5;
      return { ...prev, [`nivel${currentLevel}`]: levelAnswers };
    });
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
        return q.opciones?.some(opt => answers[`nivel${currentLevel}`][`${opt.rasgo}${opt.id}`]);
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
        await guardarRespuestas(obtenerRespuestas());
        const [perfilData, recomData] = await Promise.all([
          getPerfilByUsuario(user.sub),
          getRecomendacionesByUsuario(user.sub).catch(() => null),
        ]);
        setPerfilExistente(perfilData);
        if (recomData?.recomendaciones) setRecomendaciones(recomData.recomendaciones);
        setYaCompletado(true);
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
      setModalAbierto(false);
      setYaCompletado(false);
      setPerfilExistente(null);
      setAnswers({ nivel1: {}, nivel2: {}, nivel3: {} });
    } catch {
      alert('No se pudieron eliminar las respuestas. Intenta de nuevo.');
      setModalAbierto(false);
    } finally {
      setEliminando(false);
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
      <div style={{ padding: '60px 36px', textAlign: 'center', color: 'var(--muted)' }}>
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
        <TestCompletado perfil={perfilExistente} recomendaciones={recomendaciones} onSolicitarReinicio={handleSolicitarReinicio} />
      </>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '60px 36px', textAlign: 'center', color: 'var(--muted)' }}>
        Cargando preguntas…
      </div>
    );
  }

  // ── UI del test ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header con progress */}
      <div style={{
        padding: '20px 36px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--surf)',
        display: 'flex', alignItems: 'center', gap: 18,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <svg width="30" height="30" viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
          <rect width="40" height="40" rx="10" fill="var(--navy)" />
          <rect x="9" y="23" width="5.4" height="8" rx="1.4" fill="var(--cyanbr)" />
          <rect x="17.3" y="18" width="5.4" height="13" rx="1.4" fill="var(--cyan)" />
          <rect x="25.6" y="12" width="5.4" height="19" rx="1.4" fill="var(--green)" />
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', font: '700 12px Archivo', color: 'var(--muted)', marginBottom: 7 }}>
            <span>Nivel {currentLevel} de 3</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 7, background: 'var(--bg)', borderRadius: 99 }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: 'linear-gradient(90deg, var(--cyan), var(--green))',
              borderRadius: 99, transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
        <Link
          to="/modulos"
          style={{ font: '600 13px Archivo', color: 'var(--sub)', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          Guardar y salir
        </Link>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 24px' }}>

        {/* Título nivel */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{ font: '700 12px Archivo', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--cyandk)', marginBottom: 6 }}>
            {currentLevel === 1 && 'Escala de intereses'}
            {currentLevel === 2 && 'Preferencias · elige una opción'}
            {currentLevel === 3 && 'Profundización'}
          </div>
          <h1 style={{ font: '800 22px Archivo', letterSpacing: '-.01em', color: 'var(--text)', margin: 0 }}>
            {currentLevel === 1 && '¿Qué tan de acuerdo estás con cada afirmación?'}
            {currentLevel === 2 && '¿Cuál actividad prefieres?'}
            {currentLevel === 3 && '¿Con qué frecuencia haces esto?'}
          </h1>
        </div>

        {/* NIVEL 1 */}
        {currentLevel === 1 && (
          <LikertTable
            questions={visibleQuestions}
            answers={answers}
            levelKey={`nivel${currentLevel}`}
            onChange={handleLikertChange}
          />
        )}

        {/* NIVEL 2 */}
        {currentLevel === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {visibleQuestions.map(q => {
              const selectedKey = Object.keys(answers[`nivel${currentLevel}`] || {})
                .find(k => q.opciones?.some(opt => `${opt.rasgo}${opt.id}` === k));
              return (
                <div key={q.id} style={{
                  background: 'var(--surf)',
                  border: '1px solid var(--line)',
                  borderRadius: 16,
                  padding: '20px 24px',
                }}>
                  <p style={{ font: '600 15px Archivo', color: 'var(--text)', marginBottom: 16, lineHeight: 1.5 }}>
                    {q.text}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {q.opciones?.map(opt => {
                      const key = `${opt.rasgo}${opt.id}`;
                      const isSelected = answers[`nivel${currentLevel}`][key] === 5;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleOptionChange(q, opt)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '13px 16px',
                            borderRadius: 12,
                            border: isSelected ? '2px solid var(--cyan)' : '2px solid var(--line)',
                            background: isSelected ? 'rgba(21,166,204,.07)' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s',
                            font: '500 14px Archivo',
                            color: isSelected ? 'var(--cyandk)' : 'var(--text)',
                          }}
                        >
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                            border: isSelected ? '6px solid var(--cyan)' : '2px solid var(--line)',
                            background: 'transparent',
                            transition: 'all 0.15s',
                          }} />
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* NIVEL 3 */}
        {currentLevel === 3 && (
          <LikertTable
            questions={visibleQuestions}
            answers={answers}
            levelKey={`nivel${currentLevel}`}
            onChange={handleLikertChange}
          />
        )}

        {/* Footer: botón continuar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
          <div style={{ font: '500 13px Archivo', color: 'var(--muted)' }}>
            {Object.keys(answers[`nivel${currentLevel}`] || {}).length} / {visibleQuestions.length} respondidas
          </div>
          <button
            onClick={handleSubmit}
            disabled={guardando}
            style={{
              border: 0,
              background: guardando ? 'var(--sub)' : 'var(--navy)',
              color: '#fff',
              font: '800 14px Archivo',
              padding: '13px 28px',
              borderRadius: 12,
              cursor: guardando ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'background 0.15s',
            }}
          >
            {guardando ? 'Guardando…' : currentLevel === 3 ? 'Finalizar' : 'Continuar'}
            {!guardando && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6 L15 12 L9 18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
