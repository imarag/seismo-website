export default function Select({
  className = "",
  size = "medium",
  optionsList = [],
  ...attrs
}) {
  const baseClass = "select select-bordered rounded-md";
  const sizeMapping = {
    "extra-small": "select-xs",
    small: "select-sm",
    medium: "select-md",
    large: "select-lg",
  };
  const globalClass = `${baseClass} ${
    sizeMapping[size] || sizeMapping["medium"]
  } ${className}`;
  return (
    <select className={globalClass} {...attrs}>
      {optionsList.map((el) => (
        <option key={el.value} value={el.value}>
          {el.label}
        </option>
      ))}
    </select>
  );
}
