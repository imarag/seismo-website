export default function Select({
  className = "",
  size = "md",
  optionsList = [],
  ...props
}) {
  return (
    <select
      className={`select select-${size} select-bordered ${className}`}
      {...props}
    >
      {optionsList.map((el) => (
        <option key={el.value} value={el.value}>
          {el.label}
        </option>
      ))}
    </select>
  );
}
