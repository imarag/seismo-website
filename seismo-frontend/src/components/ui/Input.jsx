export default function Input({
  type = "text",
  size = "md",
  className = "",
  ...props
}) {
  let baseClass = "";

  if (type === "range") {
    baseClass = `range range-${size}`;
  } else if (type === "radio") {
    baseClass = `radio radio-${size}`;
  } else if (type === "checkbox") {
    baseClass = `checkbox checkbox-${size}`;
  } else {
    baseClass = `input rounded-md input-${size}`;
  }

  const globalClass = `${baseClass} input-bordered ${className}`.trim();

  return <input type={type} className={globalClass} {...props} />;
}
