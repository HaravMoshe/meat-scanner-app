export function Button({ children, onClick, variant = 'default', ...props }) {
  const base = 'px-4 py-2 rounded font-medium';
  const styles = variant === 'outline'
    ? 'border border-gray-400 text-gray-700 bg-white'
    : 'bg-blue-600 text-white hover:bg-blue-700';
  return (
    <button onClick={onClick} className={\`\${base} \${styles}\`} {...props}>
      {children}
    </button>
  );
}
