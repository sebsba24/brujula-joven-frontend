import { useEffect, useState } from "react";
import { getPreguntas } from "../services/api";

export const useTestEngine = () => {

  const [allQuestions, setAllQuestions] = useState([]);
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  });

  const [currentLevel, setCurrentLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // =========================
  // CARGA INICIAL
  // =========================
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const data = await getPreguntas();
        
        // Adaptar estructura base
        const preguntas = data.map(p => ({
          id: p.id_pregunta,
          text: p.descripcion,
          rasgo: p.rasgo,
          tipo: p.tipo,
          nivel: p.nivel,
          grupo: p.grupo || null,
          valor: p.valor || 1
        }));
        console.log("DATA BACKEND:", data);
        setAllQuestions(preguntas);

        // Inicial: solo nivel 1
        setVisibleQuestions(preguntas.filter(p => p.nivel === 1));

      } catch (error) {
        console.error("Error cargando preguntas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreguntas();
  }, []);

  // =========================
  // RESPONDER
  // =========================
  const answerQuestion = (question, value) => {

    // Guardar respuesta
    setAnswers(prev => ({
      ...prev,
      [`${question.rasgo}${question.id}`]: value
    }));

    // Actualizar puntaje
    if (question.rasgo) {
      setScores(prev => ({
        ...prev,
        [question.rasgo]: prev[question.rasgo] + value
      }));
    }
  };

  // =========================
  // SIGUIENTE NIVEL
  // =========================
  const nextLevel = () => {

    // NIVEL 1 → NIVEL 2
    if (currentLevel === 1) {
      const top2 = getTop(scores, 2);

      const nivel2 = allQuestions.filter(q =>
        q.nivel === 2 && top2.includes(q.rasgo)
      );

      setVisibleQuestions(nivel2);
      setCurrentLevel(2);
    }

    // NIVEL 2 → NIVEL 3
    else if (currentLevel === 2) {
      const top1 = getTop(scores, 1)[0];

      const nivel3 = allQuestions.filter(q =>
        q.nivel === 3 && q.rasgo === top1
      );

      setVisibleQuestions(nivel3);
      setCurrentLevel(3);
    }

    // FINAL
    else {
      setIsFinished(true);
    }
  };

  // =========================
  // TOP RASGOS
  // =========================
  const getTop = (scoresObj, n) => {
    return Object.entries(scoresObj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(e => e[0]);
  };

  // =========================
  // PROGRESO
  // =========================
  const progress = visibleQuestions.length
    ? (Object.keys(answers).length / visibleQuestions.length) * 100
    : 0;

  // =========================
  // RESULTADO JSON
  // =========================
  const buildResult = () => {
    return {
      respuestas: answers,
      scores
    };
  };

  return {
    loading,
    visibleQuestions,
    answerQuestion,
    nextLevel,
    currentLevel,
    scores,
    progress,
    isFinished,
    buildResult
  };
};