export default function QuestionCard({ question, onAnswer }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md text-center">
      <h2 className="text-lg font-semibold mb-6">
        {question.text}
      </h2>

      {question.type === "likert" && (
        <div className="flex justify-between">
          {[1,2,3,4,5].map(n => (
            <button
              key={n}
              onClick={() => onAnswer(n, question.pesos)}
              className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-blue-500 hover:text-white"
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {question.type === "choice" && (
        <div className="grid gap-3">
          {question.options ? (
            question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onAnswer(1, opt.pesos)}
              >
                {opt.text}
              </button>
            ))
          ) : (
            [1,2,3,4,5].map(n => (
              <button
                key={n}
                onClick={() => onAnswer(n - 3, question.pesos)}
              >
                {n}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}