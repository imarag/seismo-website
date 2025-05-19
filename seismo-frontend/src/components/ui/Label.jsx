export default function Label({ className = "", children, ...attrs }) {
  const baseClass = `label label-text px-0 py-1 ${className}`;

  return (
    <label className={baseClass} {...attrs}>
      {children}
    </label>
  );
}
