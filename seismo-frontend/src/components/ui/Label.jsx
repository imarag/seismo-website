export default function Label({ label, className = "", ...props }) {
  const labelElementClass = `label label-text ${className} px-0 py-1`.trim();

  return (
    <label className={labelElementClass} {...props}>
      {label}
    </label>
  );
}
