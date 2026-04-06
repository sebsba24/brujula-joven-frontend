import { useEffect, useState } from "react";
import { getPreguntasPorRasgo, getPreguntasPorNivel, getPreguntasMultiplesPorGrupo } from "../services/api";

export const useTestEngine = () => {

  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [scores, setScores] = useState({
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  });

  const [currentLevel, setCurrentLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  // =========================
  // CARGA INICIAL
  // =========================
  useEffect(() => {
  const fetchNivel1 = async () => {
    try {
      const data = await getPreguntasPorNivel(1);

      const preguntas = data.map(p => ({
        id: p.id_pregunta,
        text: p.descripcion,
        rasgo: p.rasgo,
        tipo: "likert"
      }));

      setVisibleQuestions(preguntas);

    } catch (error) {
      console.error("Error cargando nivel 1:", error);
    } finally {
      setLoading(false);
    }
  };

    fetchNivel1();
  }, []);

  // =========================
  // RESPONDER
  // =========================
  const answerQuestion = (question, option) => {

    if (question.tipo === "multiple") {
      setScores(prev => ({
        ...prev,
        [option.rasgo]: prev[option.rasgo] + option.valor
      }));
      return;
    }

    // likert normal
    setScores(prev => ({
      ...prev,
      [question.rasgo]: prev[question.rasgo] + option
    }));
  };

  // =========================
  // SIGUIENTE NIVEL
  // =========================
  const nextLevel = async () => {

    // =========================
    // NIVEL 1 → NIVEL 2
    // =========================
    if (currentLevel === 1) {
      const grupo = "A";

      try {
        const data = await getPreguntasMultiplesPorGrupo(grupo);
        const preguntas = data.map(p => ({
          id: p.id,
          text: p.enunciado,
          tipo: "multiple",
          opciones: p.opciones.map(op => ({
            id: op.id,
            text: op.texto,
            rasgo: op.rasgo,
            valor: 5
          }))
        }));

        setVisibleQuestions(preguntas);
        setCurrentLevel(2);

      } catch (error) {
        console.error("Error cargando nivel 2:", error);
      }
    }

    // =========================
    // NIVEL 2 → NIVEL 3
    // =========================
    else if (currentLevel === 2) {

      try {
        const top1 = getTop(scores, 1)[0];

        const data = await getPreguntasPorRasgo(top1);

        //IMPORTANTE: mapear como nivel 3 tipo likert
        const preguntasNivel3  = data
          .filter(p => p.nivel === 3) // seguridad
          .map(p => ({
            id: p.id_pregunta,
            text: p.descripcion,
            rasgo: p.rasgo,
            tipo: "likert"
          }));

        setVisibleQuestions(preguntasNivel3 );
        setCurrentLevel(3);

      } catch (error) {
        console.error("Error cargando nivel 3:", error);
      }
    }

    // =========================
    // FINAL
    // =========================
    else {
      console.log("TEST FINALIZADO");
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

  return {
    loading,
    visibleQuestions,
    answerQuestion,
    nextLevel,
    currentLevel,
    scores
  };
};