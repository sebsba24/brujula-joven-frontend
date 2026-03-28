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
    <div className="bg-white p-6 rounded-2xl shadow-md">

      <h2 className="text-xl font-bold mb-4">
        Responde las siguientes preguntas
      </h2>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="flex items-center justify-between">

            <p className="w-2/3 text-left">{q.text}</p>

            <div className="flex gap-2">
              {[1,2,3,4,5].map((val) => (
                <input
                  key={val}
                  type="radio"
                  name={`q-${q.id}`}
                  onChange={() => handleChange(q.id, val)}
                />
              ))}
            </div>

          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-xl"
      >
        Siguiente
      </button>
    </div>
  );
}