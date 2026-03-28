import { Link } from 'react-router-dom'
import LikertBlock from "../../components/tests/LikertBlock";
import QuestionCard from "../../components/tests/QuestionCard";
import ResultView from "../../components/tests/ResultView";
import { useTestEngine } from "../../hooks/useTestEngine";

export default function TestPage() {
  const {
    fase,
    pool,
    question,
    answer,
    answerBlock,
    scores,
    isFinished
  } = useTestEngine();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modulos" className="hover:text-blue-400">Módulos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Test</span>
      </div>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">📊</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo Test Vocacional</h1>
          <p className="text-gray-400 mt-1">Responde el siguiente cuestionario para identificar cuales son tus aptitudes.</p>
        </div>
      </div>

      {/* FASE 1 → BLOQUE */}
      {fase === 1 && (
        <LikertBlock
          questions={pool}
          onSubmit={(answers) => answerBlock(answers, pool)}
        />
      )}

      {/* FASE 2 y 3 → UNA A UNA */}
      {(fase === 2 || fase === 3) && !isFinished && (
        <QuestionCard
          question={question}
          onAnswer={answer}
        />
      )}

      {/* RESULTADO */}
      {isFinished && <ResultView scores={scores} />}

    </div>
  );
}