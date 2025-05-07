export function Button({ children, onClick, variant = 'default', ...props }) {
  return (
    <button
      onClick={onClick}
      className={`${variant === 'outline' ? 'border border-gray-400' : 'bg-blue-600 text-white'} px-4 py-2 rounded`}
      {...props}
    >
      {children}
    </button>
  );
}
