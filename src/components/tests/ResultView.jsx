export default function ResultView({ scores }) {
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  const [top1, top2] = sorted;

  const nombres = {
    R: "Realista",
    I: "Investigador",
    A: "Artístico",
    S: "Social",
    E: "Emprendedor",
    C: "Convencional"
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">
        Tu perfil: {nombres[top1[0]]} + {nombres[top2[0]]}
      </h2>

      <p className="mb-4">
        Perfil dominante con afinidad secundaria.
      </p>

      <div className="space-y-2">
        {sorted.map(([k, v]) => (
          <div key={k}>
            {nombres[k]}: {v}
          </div>
        ))}
      </div>
    </div>
  );
}