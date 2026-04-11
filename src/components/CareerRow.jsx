export default function CareerRow({ title, data }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-3 text-white">{title}</h2>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {data.map((item, index) => (
          <div key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}