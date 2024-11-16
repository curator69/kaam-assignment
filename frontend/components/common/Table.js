export default function Table({ headers, data = [], onRowClick }) {
  console.log("Table data:", data);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(data) &&
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
              >
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {header.render ? header.render(row) : row[header.key]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
