export default function Select({
  className = "",
  size = "medium",
  optionslist = [],
  ...attrs
}) {
  const baseClass = "select select-bordered";
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
      {optionslist.map((el) => (
        <option key={el.value} value={el.value}>
          {el.label}
        </option>
      ))}
    </select>
  );
}
