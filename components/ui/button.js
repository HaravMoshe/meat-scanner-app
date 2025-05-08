export function Button({ children, onClick, variant = 'default', ...props }) {
  const base = 'px-4 py-2 rounded font-medium focus:outline-none';
  const styles = variant === 'outline'
    ? 'border border-gray-400 text-gray-700 bg-white hover:bg-gray-100'
    : 'bg-blue-600 text-white hover:bg-blue-700';
  return (
    <button onClick={onClick} className={`${base} ${styles}`} {...props}>
      {children}
    </button>
  );
}
