export function Table({ children }) {
  return <table className="min-w-full divide-y divide-gray-200">{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TableHead({ children }) {
  return <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</th>;
}

export function TableRow({ children }) {
  return <tr className="hover:bg-gray-100">{children}</tr>;
}

export function TableBody({ children }) {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
}

export function TableCell({ children }) {
  return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{children}</td>;
}
