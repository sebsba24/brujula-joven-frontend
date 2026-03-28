export default function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
      <div
        className="bg-blue-500 h-3 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}