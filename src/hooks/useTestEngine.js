import { useEffect, useState } from "react";
import { getPreguntas } from "../services/api";

export const useTestEngine = () => {

  const [fase, setFase] = useState(1);
  const [index, setIndex] = useState(0);

  const [scores, setScores] = useState({
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  });

  const [pool, setPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState({
    fase1: [],
    fase2: [],
    fase3: []
  });

 useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const data = await getPreguntas();

        // SOLO ENUNCIADOS
        const enunciados = data.filter(p => p.tipo === "Enunciado");
        console.log(data);
        // ADAPTAR SOLO ENUNCIADOS
        const preguntasAdaptadas = enunciados.map(p => ({
          id: p.id_pregunta,
          text: p.descripcion,
          rasgo: p.rasgo,
          pesos: {
            [p.rasgo]: 1
          },
          nivel: p.nivel
        }));
        
        const preguntasPorFase = {
          fase1: preguntasAdaptadas.filter(p => p.nivel === 1),
          fase2: preguntasAdaptadas.filter(p => p.nivel === 2),
          fase3: preguntasAdaptadas.filter(p => p.nivel === 3)
        };

        setQuestions(preguntasPorFase);
        setPool(preguntasPorFase.fase1);


      } catch (error) {
        console.error("Error cargando preguntas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreguntas();
  }, []);

  // =========================
  // RESPUESTA BLOQUE (FASE 1)
  // =========================
  const answerBlock = (answers, questionsBlock) => {
    let newScores = { ...scores };

    questionsBlock.forEach(q => {
      const val = answers[q.id];

      Object.keys(q.pesos).forEach(p => {
        newScores[p] += q.pesos[p] * val;
      });
    });

    setScores(newScores);
    avanzarFase(newScores);
  };

  // =========================
  // RESPUESTA INDIVIDUAL (F2-F3)
  // =========================
  const answer = (value, pesos) => {
    let newScores = { ...scores };

    Object.keys(pesos).forEach(p => {
      newScores[p] += pesos[p] * value;
    });

    setScores(newScores);

    if (index + 1 < pool.length) {
      setIndex(index + 1);
    } else {
      avanzarFase(newScores);
    }
  };

  // =========================
  // CAMBIO DE FASE
  // =========================
  const avanzarFase = (scoresActuales) => {

    // 🔹 FASE 1 → FASE 2
    if (fase === 1) {
      const top3 = getTop(scoresActuales, 3);

      let nuevasPreguntas = [];

      top3.forEach(rasgo => {
        nuevasPreguntas = [
          ...nuevasPreguntas,
          ...questions.fase2.filter(q => q.rasgo === rasgo)
        ];
      });

      setPool(nuevasPreguntas);
      setFase(2);
      setIndex(0);
    }

    // 🔹 FASE 2 → FASE 3
    else if (fase === 2) {
      setPool(questions.fase3);
      setFase(3);
      setIndex(0);
    }

    // 🔹 FINAL
    else {
      setFase(4);
    }
  };

  // =========================
  // TOP PERFILES
  // =========================
  const getTop = (scores, n) => {
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(e => e[0]);
  };

  // =========================
  // RETORNO DEL HOOK
  // =========================
  return {
    fase,
    pool,
    question: pool[index],
    answer,
    answerBlock, 
    scores,
    progress: pool.length ? ((index + 1) / pool.length) * 100 : 0,
    isFinished: fase === 4
  };
};