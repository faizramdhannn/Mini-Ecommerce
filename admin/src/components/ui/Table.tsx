import { Spinner } from './Spinner';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function Table<T extends { id: number }>({ columns, data, isLoading, emptyMessage = 'No data available' }: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 bg-dark-950 border border-dark-800 rounded-xl">
        <Spinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 bg-dark-950 border border-dark-800 rounded-xl">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-950 border border-dark-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-900 border-b border-dark-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-dark-900 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(item) : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}