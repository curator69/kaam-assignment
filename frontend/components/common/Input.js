export default function Input({ label, error, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`block w-full rounded-md shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
          ${error ? "border-red-300" : ""}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
